import { Shield } from "lucide-react";

interface PolicyCardProps {
  flight?: string;
  hotel?: string;
  food?: string;
  ground?: string;
}

export function PolicyCard({ 
  flight = "Economy flights only",
  hotel = "Hotel cap $250/night",
  food = "Food per-diem $70/day",
  ground = "Rideshare allowed"
}: PolicyCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-[#1246A5]" />
        <h3 className="m-0">Policy Summary</h3>
      </div>
      <div className="space-y-2">
        <PolicyItem label="Flights" value={flight} />
        <PolicyItem label="Hotel" value={hotel} />
        <PolicyItem label="Food" value={food} />
        <PolicyItem label="Ground" value={ground} />
      </div>
    </div>
  );
}

function PolicyItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-500 text-sm min-w-[60px]">{label}:</span>
      <span className="text-[#1F2933] text-sm">{value}</span>
    </div>
  );
}
