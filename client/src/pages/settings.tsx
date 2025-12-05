import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Eye, Trash2, UserX, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-full flex flex-col bg-background p-6 pb-24">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Scanning Preferences</h2>
          <Card className="bg-card/50 border-white/5 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Deep OCR Scan</Label>
                  <p className="text-[10px] text-muted-foreground">Analyze text inside images</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Face Detection</Label>
                  <p className="text-[10px] text-muted-foreground">Count faces in photos</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Data & Notifications</h2>
          <Card className="bg-card/50 border-white/5 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-yellow-500/10 text-yellow-500">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Risk Alerts</Label>
                  <p className="text-[10px] text-muted-foreground">Notify on high risk findings</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-purple-500/10 text-purple-500">
                  <Database className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Save History</Label>
                  <p className="text-[10px] text-muted-foreground">Keep local record of scans</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>

        <div className="pt-4">
           <button className="w-full p-4 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center gap-2 text-sm font-medium hover:bg-red-500/20 transition-colors">
             <Trash2 className="w-4 h-4" />
             Clear All Scan Data
           </button>
        </div>
      </div>
    </div>
  );
}
