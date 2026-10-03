import { User } from "lucide-react";
import bgImage from "figma:asset/68491a71f021c38c1c7368d77b05b5434580c49f.png";
import gnbLogo from "../../assets/brand/worktrip-autopilot-gnb.svg";

interface AppShellProps {
  children: React.ReactNode;
  currentNav?: string;
  onNavChange?: (nav: string) => void;
  onLogoClick?: () => void;
}

export function AppShell({ children, currentNav = "Trips", onNavChange, onLogoClick }: AppShellProps) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Frosted Glass Top Navigation Bar */}
      {/* The bar paints a tall band above itself as well as behind. Rubber-band
          scrolling past the top otherwise pulls the page away and shows the
          background through the gap, which reads as the bar coming unstuck. */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 h-16 flex items-center px-4 sm:px-6 shadow-sm before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-full before:h-[50vh] before:bg-white/70 before:backdrop-blur-xl before:pointer-events-none">
        <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 flex-1 min-w-0">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src={gnbLogo}
              alt="Worktrip Autopilot"
              className="h-[22px] sm:h-[26px] w-auto"
            />
          </button>
          
          <nav className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
            {["Plan a Trip", "My Trips", "Policies"].map((item) => (
              <button
                key={item}
                onClick={() => onNavChange?.(item)}
                className={`text-sm transition-all whitespace-nowrap ${
                  currentNav === item
                    ? "text-[#0A0A0A] font-medium"
                    : "text-[#4A5565] hover:text-[#0A0A0A]"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center">
          {/* The avatar was a grey disc, the one element on the bar that
              belonged to no palette. Purple ties it to the primary action. */}
          <button
            type="button"
            aria-label="Account"
            className="group flex items-center gap-2 p-1 rounded-full transition-all hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#916AF5]/45"
          >
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#916AF5] flex items-center justify-center transition-transform group-hover:scale-105">
              <User className="w-[18px] h-[18px] text-white" strokeWidth={1.75} />
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}