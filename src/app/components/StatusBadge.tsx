interface StatusBadgeProps {
  status: "Planned" | "Booking" | "Upcoming" | "In progress" | "Needs expenses" | "Completed" | "Compliant" | "Needs exception";
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  "Planned": "bg-gray-100 text-gray-700 border-gray-200",
  "Booking": "bg-[#18A0A6]/10 text-[#18A0A6] border-[#18A0A6]/20",
  "Upcoming": "bg-[#1246A5]/10 text-[#1246A5] border-[#1246A5]/20",
  "In progress": "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20",
  "Needs expenses": "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20",
  "Completed": "bg-[#1F9D55]/10 text-[#1F9D55] border-[#1F9D55]/20",
  "Compliant": "bg-[#1F9D55]/10 text-[#1F9D55] border-[#1F9D55]/20",
  "Needs exception": "bg-[#D64545]/10 text-[#D64545] border-[#D64545]/20",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  
  return (
    <span
      className={`inline-flex items-center rounded-full border ${statusStyles[status]} ${sizeClasses}`}
    >
      {status}
    </span>
  );
}
