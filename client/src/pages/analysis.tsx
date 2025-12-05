import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle, 
  ChevronLeft, 
  Eye, 
  FileText, 
  MapPin, 
  Share2, 
  Smartphone, 
  User,
  ScanLine,
  Download,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { analyzeProfile, getReportUrl, type Scan } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Analysis() {
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<Scan | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const url = searchParams.get("url") || "";
  const platform = searchParams.get("platform") || "instagram";

  useEffect(() => {
    if (!url) {
      setLocation("/");
      return;
    }

    const steps = [
      "Connecting to public profile...",
      "Extracting bio and metadata...",
      "Scanning recent images...",
      "Running OCR analysis...",
      "Detecting faces and locations...",
      "Calculating risk score..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setScanStep(currentStep);
      }
    }, 500);

    analyzeProfile(url, platform).then((data) => {
      setResult(data);
      clearInterval(interval);
      setTimeout(() => setLoading(false), 600);
    }).catch((error) => {
      console.error("Analysis failed:", error);
      clearInterval(interval);
      setLoading(false);
    });

    return () => clearInterval(interval);
  }, [url, platform, setLocation]);

  const scanLogs = [
    "Connecting to public profile...",
    "Extracting bio and metadata...",
    "Scanning recent images...",
    "Running OCR analysis...",
    "Detecting faces and locations...",
    "Calculating risk score..."
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="scan-line animate-scan" />
        
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xs">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
            <div className="absolute inset-0 border-4 border-t-primary border-r-primary/50 border-b-transparent border-l-transparent rounded-full animate-spin" />
            <div className="absolute inset-4 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ScanLine className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "linear" }}
              />
            </div>
            <p className="text-xs font-mono text-primary text-center h-4">
              {scanLogs[scanStep]}
            </p>
          </div>

          <div className="w-full bg-card/50 border border-primary/10 rounded-lg p-4 font-mono text-[10px] text-muted-foreground h-32 overflow-hidden flex flex-col-reverse">
             {scanLogs.slice(0, scanStep + 1).reverse().map((log, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="border-l-2 border-primary/30 pl-2 py-1 mb-1"
               >
                 <span className="text-primary/50 mr-2">{`>`}</span>
                 {log}
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">Analysis failed. Please try again.</p>
        <Button onClick={() => setLocation("/")} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const findingsList = [
    ...(result.findings.phones?.map((p) => ({ id: `phone-${p}`, type: "phone" as const, value: p, location: "Bio / Posts", severity: "Critical" as const })) || []),
    ...(result.findings.emails?.map((e) => ({ id: `email-${e}`, type: "email" as const, value: e, location: "Bio / Posts", severity: "High" as const })) || []),
    ...(result.findings.faces > 0 ? [{ id: "faces", type: "face" as const, value: `${result.findings.faces} face(s) detected`, location: "Photos", severity: "Medium" as const }] : []),
    ...(result.findings.gps ? [{ id: "gps", type: "location" as const, value: result.findings.gps, location: "Image Metadata", severity: "High" as const }] : []),
  ];

  return (
    <div className="min-h-full flex flex-col bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="h-8 w-8 -ml-2">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="font-mono text-sm font-bold uppercase tracking-wider">Analysis Report</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-primary">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-8 flex flex-col items-center justify-center relative bg-gradient-to-b from-primary/5 to-transparent">
        <ScoreGauge score={result.riskScore} />
        
        <div className="mt-6 flex items-center gap-3 px-4 py-1.5 rounded-full bg-card border border-white/10">
          {result.avatarUrl && <img src={result.avatarUrl} className="w-6 h-6 rounded-full ring-1 ring-white/20" alt="Avatar" />}
          <span className="text-sm font-medium text-foreground">@{result.username}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full px-4">
        <TabsList className="w-full grid grid-cols-3 h-11 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg text-xs">Overview</TabsTrigger>
          <TabsTrigger value="findings" className="rounded-lg text-xs">Findings</TabsTrigger>
          <TabsTrigger value="actions" className="rounded-lg text-xs">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-card/50 border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-card/80 transition-colors">
              <Eye className="w-5 h-5 text-blue-400" />
              <div className="text-center">
                <span className="block text-2xl font-bold">{result.stats.followers}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Reach</span>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-card/80 transition-colors">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <div className="text-center">
                <span className="block text-2xl font-bold">{result.leaks.length}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Leaks</span>
              </div>
            </Card>
          </div>

          <Card className="p-5 border-l-4 border-l-primary bg-card/50">
            <h3 className="font-medium mb-2 text-sm">Risk Assessment</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your profile has a <span className={cn("font-bold", 
                result.riskLevel === 'Critical' ? "text-red-500" : 
                result.riskLevel === 'High' ? "text-orange-500" : 
                result.riskLevel === 'Medium' ? "text-yellow-500" : "text-green-500"
              )}>{result.riskLevel}</span> exposure level. 
              {result.leaks.length > 0 ? " Detected issues: " + result.leaks.join(", ") + "." : " No significant issues detected."}
            </p>
          </Card>

          <a href={getReportUrl(result.id)} download className="block">
            <Button className="w-full gap-2" variant="outline">
              <Download className="w-4 h-4" />
              Download PDF Report
            </Button>
          </a>
        </TabsContent>

        <TabsContent value="findings" className="space-y-3 mt-4 animate-in slide-in-from-bottom-4 duration-500">
          {findingsList.length === 0 ? (
            <Card className="p-6 bg-card/50 border-white/5 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sensitive data detected!</p>
            </Card>
          ) : (
            findingsList.map((finding) => (
              <Card key={finding.id} className="p-4 flex items-start gap-3 bg-card/50 border-white/5 overflow-hidden relative group">
                <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                  finding.severity === 'Critical' ? "bg-red-500" : 
                  finding.severity === 'High' ? "bg-orange-500" : "bg-yellow-500"
                )} />
                
                <div className="p-2 bg-muted rounded-full shrink-0">
                  {finding.type === 'phone' && <Smartphone className="w-4 h-4 text-foreground" />}
                  {finding.type === 'email' && <Mail className="w-4 h-4 text-foreground" />}
                  {finding.type === 'location' && <MapPin className="w-4 h-4 text-foreground" />}
                  {finding.type === 'face' && <User className="w-4 h-4 text-foreground" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{finding.type}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                      finding.severity === 'Critical' ? "bg-red-500/10 text-red-500" : 
                      finding.severity === 'High' ? "bg-orange-500/10 text-orange-500" : "bg-yellow-500/10 text-yellow-500"
                    )}>{finding.severity}</span>
                  </div>
                  <p className="text-sm font-medium truncate">{finding.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">Found in: {finding.location}</p>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-3 mt-4 animate-in slide-in-from-bottom-4 duration-500">
          {result.recommendations.map((rec, i) => (
            <Card key={i} className="p-4 flex gap-3 items-center bg-card/50 border-white/5">
              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">{rec}</p>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
