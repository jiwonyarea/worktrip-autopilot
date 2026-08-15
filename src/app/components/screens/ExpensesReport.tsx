import { Upload, Download, Check, AlertCircle, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { StatusBadge } from "../StatusBadge";
import { supabaseUrl, publicAnonKey } from "../../utils/supabase/info";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

interface Expense {
  id: string;
  trip_id: string;
  date: string;
  merchant: string;
  category: string;
  traveler: string;
  amount: number;
  policy_status: string;
  receipt_url: string | null;
  created_at?: string;
}

interface ExpensesReportProps {
  tripId?: string;
  onBack?: () => void;
}

export function ExpensesReport({ tripId = "default-trip", onBack }: ExpensesReportProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize Supabase client
  const supabase = createClient(
    supabaseUrl,
    publicAnonKey
  );

  // Fetch expenses from Supabase
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expenses");
        return;
      }

      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  // Handle file upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image (JPEG, PNG, GIF) or PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    const uploadToastId = "upload-receipt";
    toast.loading("Uploading receipt...", { id: uploadToastId });

    try {
      // Upload file to Supabase storage
      const timestamp = Date.now();
      const fileName = `${tripId}/${timestamp}-${file.name}`;
      
      console.log("Uploading file to receipts bucket:", fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("File uploaded successfully:", uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      const receiptUrl = urlData.publicUrl;
      console.log("Receipt URL:", receiptUrl);

      toast.loading("Reading the receipt...", { id: uploadToastId });

      // The agent reads the image and files the expense in one call.
      const processResponse = await fetch(
        `${supabaseUrl}/functions/v1/server/trips/${tripId}/expenses/upload-receipt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ receiptUrl }),
        },
      );

      const processData = await processResponse.json().catch(() => ({}));

      if (!processResponse.ok) {
        throw new Error(processData.error || "Could not read that receipt");
      }

      const { expense, notes } = processData;

      if (!expense) {
        throw new Error("No expense data returned from processing");
      }

      // The model flags anything it could not read cleanly.
      if (notes) {
        toast.warning(`Filed, but check it: ${notes}`);
      }

      console.log("Receipt processed successfully:", expense);
      
      // Add new expense to the list (prepend to show at top)
      setExpenses(prev => [expense, ...prev]);
      
      toast.success("Receipt processed and added to expenses!", { id: uploadToastId });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload receipt",
        { id: uploadToastId }
      );
    } finally {
      setIsUploading(false);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const compliantCount = expenses.filter(e => e.policy_status === "compliant").length;
  
  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    const category = exp.category || "Other";
    acc[category] = (acc[category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const missingReceiptsCount = expenses.filter(e => !e.receipt_url).length;

  return (
    <div className="p-8">
      <div className="max-w-[1088px] mx-auto px-4 sm:px-0">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-1">Expense Report</h1>
              <p className="text-gray-600 m-0">AWS re:Invent 2025 · Dec 2-6, 2025</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload Receipt"}
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button className="bg-[#1F9D55] hover:bg-[#1a8449] text-white gap-2">
                <Check className="w-4 h-4" />
                Submit expense report
              </Button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-[#18A0A6]/10 border border-[#18A0A6]/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#18A0A6] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm m-0">
                Upload receipts to automatically extract expense details using AI. The system will capture merchant, amount, date, and categorize each expense.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Expenses Table */}
          <div className="lg:col-span-8 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="m-0">Expenses ({expenses.length})</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Select all</Button>
                  <Button variant="outline" size="sm">Filter</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading expenses...
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="p-8 text-center">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 m-0 mb-2">No expenses yet</p>
                    <p className="text-sm text-gray-400 m-0">Upload a receipt to get started!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm text-gray-600 w-8"></th>
                        <th className="text-left px-4 py-3 text-sm text-gray-600">Date</th>
                        <th className="text-left px-4 py-3 text-sm text-gray-600">Merchant</th>
                        <th className="text-left px-4 py-3 text-sm text-gray-600">Category</th>
                        <th className="text-left px-4 py-3 text-sm text-gray-600">Traveler</th>
                        <th className="text-right px-4 py-3 text-sm text-gray-600">Amount</th>
                        <th className="text-center px-4 py-3 text-sm text-gray-600">Status</th>
                        <th className="text-center px-4 py-3 text-sm text-gray-600">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense, index) => (
                        <tr 
                          key={expense.id}
                          className={`${index !== expenses.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50`}
                        >
                          <td className="px-4 py-3">
                            <Checkbox />
                          </td>
                          <td className="px-4 py-3 text-sm">{expense.date}</td>
                          <td className="px-4 py-3 text-sm">{expense.merchant}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{expense.traveler}</td>
                          <td className="px-4 py-3 text-sm text-right">${expense.amount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            {expense.policy_status === "compliant" ? (
                              <span className="inline-flex items-center gap-1 text-xs text-[#1F9D55]">
                                <Check className="w-3 h-3" />
                                Within
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-[#F5A623]">
                                <AlertCircle className="w-3 h-3" />
                                Over
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {expense.receipt_url ? (
                              <a 
                                href={expense.receipt_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center hover:opacity-70"
                                title="View receipt"
                              >
                                <Check className="w-4 h-4 text-[#1F9D55] mx-auto" />
                              </a>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs gap-1"
                                onClick={handleUploadClick}
                              >
                                <Upload className="w-3 h-3" />
                                Upload
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Expense Summary */}
          <div className="col-span-4 space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-4">Expense summary</h3>
              
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm text-gray-600">Total expenses</span>
                    <span className="text-2xl">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(categoryTotals).length > 0 ? (
                    Object.entries(categoryTotals).map(([category, amount]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span className="text-gray-600">{category}</span>
                        <span>${amount.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-2">No expenses yet</p>
                  )}
                </div>

                {expenses.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-[#1F9D55] mb-1">
                      <Check className="w-4 h-4" />
                      <span>{compliantCount} of {expenses.length} within policy</span>
                    </div>
                    {compliantCount < expenses.length && (
                      <div className="flex items-center gap-2 text-sm text-[#F5A623]">
                        <AlertCircle className="w-4 h-4" />
                        <span>{expenses.length - compliantCount} over per-diem</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Draft Report Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="w-5 h-5 text-[#1246A5]" />
                <h3 className="m-0">Draft expense report</h3>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Project code</div>
                  <div className="text-sm">CONF-2025-Q4</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Cost center</div>
                  <div className="text-sm">Engineering</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <StatusBadge status="Planned" size="sm" />
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                Edit report details
              </Button>
            </div>

            {/* Missing Receipts */}
            {missingReceiptsCount > 0 && (
              <div className="bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#F5A623] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm mb-1">{missingReceiptsCount} receipt{missingReceiptsCount !== 1 ? 's' : ''} missing</div>
                    <p className="text-xs text-gray-600 m-0">
                      Please upload receipts for expenses over $25
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}