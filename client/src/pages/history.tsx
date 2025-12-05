import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getAllScans } from "@/lib/api";
import { ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scan } from "@shared/schema";

export default function History() {
  const [history, setHistory] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllScans()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-6">
        <div className="text-muted-foreground">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-background p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Scan History</h1>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No scans yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Start analyzing profiles to see your history</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="p-4 bg-card/50 border-white/5 hover:bg-card/80 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2",
                    item.riskLevel === 'Critical' ? "border-red-500 text-red-500 bg-red-500/10" :
                    item.riskLevel === 'High' ? "border-orange-500 text-orange-500 bg-orange-500/10" :
                    item.riskLevel === 'Medium' ? "border-yellow-500 text-yellow-500 bg-yellow-500/10" :
                    "border-green-500 text-green-500 bg-green-500/10"
                  )}>
                    {item.riskScore}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm">@{item.username}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="capitalize">{item.platform}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.scannedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
