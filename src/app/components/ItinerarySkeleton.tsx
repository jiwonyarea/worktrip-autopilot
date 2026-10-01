// The options screen while the trip is still loading. The boxes sit where the
// real cards sit, so nothing jumps when the data lands — a spinner in the
// middle of an empty page tells you to wait, this tells you what is coming.

function Bar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[6px] bg-[#e6e3ee] ${className}`}>
      <div className="skeleton-shimmer absolute inset-0" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/50 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.08)] p-5 flex flex-col">
      {/* Direction + price */}
      <Bar className="h-[20px] w-1/2 mb-2" />
      <Bar className="h-[30px] w-2/3 mb-5" />

      {/* Two flight rows, then the hotel row — the real card's three blocks. */}
      {[0, 1].map((i) => (
        <div key={i} className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <Bar className="h-[18px] w-[90px]" />
            <Bar className="h-[18px] w-[70px]" />
          </div>
          <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-3 flex items-center gap-3">
            <Bar className="h-10 w-10 rounded-[8px] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Bar className="h-[14px] w-3/4 mb-2" />
              <Bar className="h-[14px] w-1/2" />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between mb-2">
        <Bar className="h-[18px] w-[70px]" />
        <Bar className="h-[18px] w-[70px]" />
      </div>
      <div className="bg-[rgba(179,173,196,0.11)] border border-[rgba(179,173,196,0.28)] rounded-[16px] p-3 flex gap-3 mb-5">
        <Bar className="h-10 w-10 rounded-[8px] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Bar className="h-[14px] w-2/3 mb-2" />
          <Bar className="h-[14px] w-1/2" />
        </div>
      </div>

      {/* Agent notes */}
      <div className="flex flex-col gap-2 mb-[48px]">
        <Bar className="h-[14px] w-[110px] mb-1" />
        <Bar className="h-[14px] w-full" />
        <Bar className="h-[14px] w-5/6" />
      </div>

      <Bar className="mt-auto h-[44px] w-full rounded-[8px]" />
    </div>
  );
}

export function ItinerarySkeleton() {
  return (
    <div className="relative z-10 max-w-[1088px] mx-auto px-4 sm:px-6 pt-[60px]">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <Bar className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 max-w-[420px]">
          <Bar className="h-[22px] w-[200px] mb-2" />
          <Bar className="h-[16px] w-full" />
        </div>
      </div>

      <Bar className="h-[20px] w-[120px] mb-6" />
      <Bar className="h-[92px] w-full rounded-2xl mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
