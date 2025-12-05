import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Facebook, Instagram, Video, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import bgImage from "@assets/generated_images/dark_digital_security_background_with_subtle_grid.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<"facebook" | "instagram" | "tiktok">("instagram");

  const handleAnalyze = () => {
    if (!url) return;
    // Encode details in URL for the analysis page to pick up
    const params = new URLSearchParams({ url, platform });
    setLocation(`/analysis?${params.toString()}`);
  };

  return (
    <div className="min-h-full flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[45%] min-h-[300px] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{ 
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
        
        <div className="relative z-20 space-y-4 mt-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
          >
            <ShieldCheck className="w-8 h-8 text-primary" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            Exposure Analyzer
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm max-w-[280px] mx-auto"
          >
            Scan your social media footprint for privacy leaks and security risks.
          </motion.p>
        </div>
      </div>

      {/* Input Section */}
      <div className="flex-1 bg-background px-6 relative z-20 -mt-8">
        <Card className="p-1 bg-card/50 backdrop-blur-sm border-white/5 shadow-xl">
          <div className="grid grid-cols-3 gap-1 p-1 bg-muted/30 rounded-lg mb-6">
            <button
              onClick={() => setPlatform("facebook")}
              className={`flex flex-col items-center gap-1 py-2 rounded-md text-xs font-medium transition-all ${platform === 'facebook' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => setPlatform("instagram")}
              className={`flex flex-col items-center gap-1 py-2 rounded-md text-xs font-medium transition-all ${platform === 'instagram' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </button>
            <button
              onClick={() => setPlatform("tiktok")}
              className={`flex flex-col items-center gap-1 py-2 rounded-md text-xs font-medium transition-all ${platform === 'tiktok' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Video className="w-4 h-4" />
              <span>TikTok</span>
            </button>
          </div>

          <div className="space-y-4 px-2 pb-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Profile URL</label>
              <div className="relative">
                <Input 
                  placeholder={`https://${platform}.com/username`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-muted/30 border-white/10 h-12 pl-10 text-sm font-mono placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={!url}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all active:scale-[0.98]"
            >
              START SCAN
            </Button>

            <div className="pt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
                <span>No Login Required</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                <span>Public Data Only</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Recent Scans</h3>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card/30 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="w-24 h-3 bg-muted/50 rounded animate-pulse" />
                  <div className="w-16 h-2 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="w-12 h-6 bg-muted/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
