import { FileUp, Info, ChevronRight } from "lucide-react";
import svgPathsExpenses from "../../imports/svg-ao8ioib35y";

export function ExpensesTable() {
  return (
    <div className="w-full">
      {/* Blue Info Banner */}
      <div className="bg-[rgba(23,79,199,0.1)] content-stretch flex gap-[11.996px] items-start pb-[0.909px] pl-[16.903px] pr-[0.909px] pt-[16.903px] rounded-[10px] mb-6">
        <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(23,79,199,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
        <Info className="w-5 h-5 text-[#174FC7] flex-shrink-0 mt-0.5" strokeWidth={1.67} />
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[#1f2933] text-[14px] tracking-[-0.1504px]">
          Upload receipts to automatically extract expense details using AI. The system will capture merchant, amount, date, and categorize each expense.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_260px] gap-6">
        {/* Left Side - Expenses Table */}
        <div className="relative bg-white rounded-[14px] overflow-hidden">
          <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[14px]" />
          
          {/* Header with buttons */}
          <div className="h-[64.893px] relative border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between px-[15.994px] h-full">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#1f2933] text-[16px] tracking-[-0.3125px]">Expenses (2)</p>
              
              <div className="flex items-center gap-[8px]">
                {/* Select all */}
                <button className="relative bg-[#f5f7fa] h-[32px] px-[12.909px] rounded-[8px] flex items-center justify-center hover:bg-[#eef1f5]">
                  <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">Select all</p>
                </button>
                
                {/* Filter */}
                <button className="relative bg-[#f5f7fa] h-[32px] px-[12.909px] rounded-[8px] flex items-center justify-center hover:bg-[#eef1f5]">
                  <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">Filter</p>
                </button>
                
                {/* Upload Receipt */}
                <button className="relative bg-[rgba(145,106,245,0.25)] h-[35.994px] px-[12px] rounded-[8px] flex items-center justify-center gap-2 hover:bg-[rgba(145,106,245,0.35)]">
                  <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <FileUp className="w-4 h-4 text-[#1f2933]" />
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">Upload Receipt</p>
                </button>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-[#f9fafb] border-b border-[#e5e7eb] h-[44px]">
            <div className="grid grid-cols-[48px_66px_98px_104px_96px_94px_113px] items-center h-full px-4">
              <div></div>
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">Date</p>
              <div></div>
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">Merchant</p>
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">Category</p>
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px] text-right">Amount</p>
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px] text-center">File</p>
            </div>
          </div>

          {/* Row 1 - Delta Airlines */}
          <div className="border-b border-[#e5e7eb] h-[84.653px]">
            <div className="grid grid-cols-[48px_66px_98px_104px_96px_94px_113px] items-center h-full px-4">
              <div className="bg-[#f3f3f5] border-[0.674px] border-[rgba(0,0,0,0.1)] border-solid rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-[15.991px] h-[15.991px]" />
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">Dec 2, 2025</p>
              <div></div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">Delta Airlines</p>
              <div className="bg-[#f3f4f6] h-[23.976px] px-[8px] rounded-[4px] flex items-center w-fit">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] text-[#364153] text-[12px]">Flight</p>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px] text-right">$1200.00</p>
              <div className="flex justify-center">
                <svg className="w-[24px] h-[24px]" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g>
                    <path d={svgPathsExpenses.paadf00} fill="#1F2933" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2 - Hilton Midtown */}
          <div className="border-b border-[#e5e7eb] h-[84.653px]">
            <div className="grid grid-cols-[48px_66px_98px_104px_96px_94px_113px] items-center h-full px-4">
              <div className="bg-[#f3f3f5] border-[0.674px] border-[rgba(0,0,0,0.1)] border-solid rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-[15.991px] h-[15.991px]" />
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">Dec 2, 2025</p>
              <div></div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">Hilton Midtown</p>
              <div className="bg-[#f3f4f6] h-[23.976px] px-[8px] rounded-[4px] flex items-center w-fit">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] text-[#364153] text-[12px]">Hotel</p>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px] text-right">$1200.00</p>
              <div className="flex justify-center">
                <svg className="w-[24px] h-[24px]" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g>
                    <path d={svgPathsExpenses.paadf00} fill="#1F2933" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Expense Summary */}
        <div className="relative bg-white rounded-[14px] p-6 h-fit">
          <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.674px] border-solid inset-0 pointer-events-none rounded-[14px]" />
          
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#1f2933] text-[16px] tracking-[-0.3125px] mb-6">
            Expense summary
          </p>

          {/* Total expenses */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#e5e7eb]">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
              Total expenses
            </p>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] text-[#0a0a0a] text-[24px] tracking-[-0.3125px]">
              $6,642
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
                Flights
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#0a0a0a] text-[14px] tracking-[-0.1504px]">
                $3,600.00
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
                Hotels
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#0a0a0a] text-[14px] tracking-[-0.1504px]">
                $2,700.00
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
                Ground transportation
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#0a0a0a] text-[14px] tracking-[-0.1504px]">
                $0
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#4a5565] text-[14px] tracking-[-0.1504px]">
                Food & meals
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#0a0a0a] text-[14px] tracking-[-0.1504px]">
                $0
              </p>
            </div>
          </div>

          {/* Within policy badge */}
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#42be5b]" viewBox="0 0 16 16" fill="none">
              <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[#42be5b] text-[14px] tracking-[-0.1504px]">
              within policy
            </p>
          </div>

          {/* View Policy Details button */}
          <button className="w-full bg-[rgba(24,160,166,0.1)] rounded-[8px] px-4 py-3 flex items-center justify-between hover:bg-[rgba(24,160,166,0.15)] transition-colors">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[#1f2933] text-[14px] tracking-[-0.1504px]">
              View Policy Details
            </p>
            <ChevronRight className="w-4 h-4 text-[#4a5565]" />
          </button>
        </div>
      </div>
    </div>
  );
}
