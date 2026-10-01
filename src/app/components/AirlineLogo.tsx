import { useState } from "react";
import { Plane } from "lucide-react";
import { getAirlineLogos } from "../utils/airlineLogos";

// A logo that cannot go blank. The remote mark is best-effort — an unknown
// carrier, a 404, or a blocked network all land on the plane icon rather than
// an empty box, which is what the last CDN outage left behind.

interface AirlineLogoProps {
  /** The agent's flight string, e.g. "Delta · DL 5788 · PIT to JFK · 07:23 - 09:00". */
  flight?: string | null;
  alt?: string;
  /** Rendered size in px, for both the image and the fallback icon. */
  size?: number;
  /** Fill the parent box, inset slightly so the mark has room to breathe
   *  (the parent sets size and rounding). The fallback icon still uses `size`. */
  fill?: boolean;
}

export function AirlineLogo({ flight, alt = "", size = 24, fill = false }: AirlineLogoProps) {
  const sources = getAirlineLogos(flight);
  // Walk the sources in order; the plane icon is what is left when all of them
  // fail, so a dead CDN never leaves an empty box.
  const [attempt, setAttempt] = useState(0);
  const src = sources[attempt];

  if (!src) {
    return (
      <Plane
        className="text-[#6a7282]"
        style={{ width: size, height: size }}
        strokeWidth={1.75}
        aria-label={alt || "Flight"}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={fill ? undefined : { width: size, height: size }}
      className={fill ? "w-full h-full object-contain p-[6px]" : "object-contain"}
      loading="lazy"
      onError={() => setAttempt((n) => n + 1)}
    />
  );
}
