import { User, Settings } from "lucide-react";
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
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 h-16 flex items-center px-6 shadow-sm">
        <div className="flex items-center gap-12 flex-1">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src={gnbLogo}
              alt="Worktrip Autopilot"
              className="h-[26px] w-auto"
            />
          </button>
          
          <nav className="flex gap-6">
            {["Trips", "Policies", "Expenses"].map((item) => (
              <button
                key={item}
                onClick={() => onNavChange?.(item)}
                className={`text-sm transition-all ${
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
          <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#9CA3AF] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
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