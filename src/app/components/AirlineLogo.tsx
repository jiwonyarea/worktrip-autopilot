import { useState } from "react";
import { Plane } from "lucide-react";
import { getAirlineLogo } from "../utils/airlineLogos";

// A logo that cannot go blank. The remote mark is best-effort — an unknown
// carrier, a 404, or a blocked network all land on the plane icon rather than
// an empty box, which is what the last CDN outage left behind.

interface AirlineLogoProps {
  /** The agent's flight string, e.g. "Delta · DL 5788 · PIT to JFK · 07:23 - 09:00". */
  flight?: string | null;
  alt?: string;
  /** Rendered size in px, for both the image and the fallback icon. */
  size?: number;
}

export function AirlineLogo({ flight, alt = "", size = 24 }: AirlineLogoProps) {
  const src = getAirlineLogo(flight);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
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
      style={{ width: size, height: size }}
      className="object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
