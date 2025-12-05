import { Link, useLocation } from "wouter";
import { Home, History, Settings, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-0 sm:p-4">
      {/* Mobile Frame Simulator (visible on desktop, invisible on mobile) */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] bg-background sm:rounded-[2.5rem] sm:border-8 sm:border-neutral-900 overflow-hidden flex flex-col relative shadow-2xl ring-1 ring-white/10">
        
        {/* Dynamic Island / Notch (Decorative) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>

        {/* Status Bar Area */}
        <div className="h-12 w-full bg-background/80 backdrop-blur-md z-40 absolute top-0 left-0 flex items-center justify-between px-6 text-xs font-medium text-muted-foreground">
          <span>9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-current rounded-sm opacity-50"></div>
            <div className="w-4 h-2.5 bg-current rounded-sm opacity-50"></div>
            <div className="w-4 h-2.5 bg-current rounded-sm"></div>
          </div>
        </div>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative">
            {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-background/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 pb-2 z-40">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 active:scale-95 w-20 cursor-pointer">
                  <item.icon 
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none"></div>
      </div>
    </div>
  );
}
