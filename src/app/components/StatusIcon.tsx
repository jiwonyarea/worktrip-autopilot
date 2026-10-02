// The filled tick used wherever the product says something passed — the dial on
// the totals card, the booking confirmations, the expense summary. Filled, not
// outlined: at this size an outlined tick reads as a ring with something inside
// it, and the ring is not the message.

interface StatusIconProps {
  /** The disc colour. The tick itself is always white. */
  color?: string;
  size?: number;
  className?: string;
}

export function StatusIcon({ color = "#1F9D55", size = 18, className = "" }: StatusIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" fill={color} />
      <path
        d="M5.9 10.3 L8.6 13 L14.1 7.4"
        fill="none"
        stroke="#fff"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
