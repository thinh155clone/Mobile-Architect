import { Card } from "@/components/ui/card";
import { getHistory } from "@/lib/mock-api";
import { ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function History() {
  const history = getHistory();

  return (
    <div className="min-h-full flex flex-col bg-background p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Scan History</h1>
      
      <div className="space-y-4">
        {history.map((item) => (
          <Card key={item.id} className="p-4 bg-card/50 border-white/5 hover:bg-card/80 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2",
                  item.riskLevel === 'Critical' ? "border-red-500 text-red-500 bg-red-500/10" :
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
    </div>
  );
}
