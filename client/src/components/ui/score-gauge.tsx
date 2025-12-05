import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  className?: string;
}

export function ScoreGauge({ score, className }: ScoreGaugeProps) {
  // Calculate circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let colorClass = "text-emerald-500";
  if (score > 20) colorClass = "text-yellow-500";
  if (score > 50) colorClass = "text-orange-500";
  if (score > 75) colorClass = "text-red-500";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer Glow */}
      <div className={cn("absolute inset-0 blur-2xl opacity-20 rounded-full", colorClass.replace("text-", "bg-"))} />
      
      <svg className="transform -rotate-90 w-48 h-48">
        {/* Track */}
        <circle
          className="text-muted stroke-current"
          strokeWidth="12"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
        />
        {/* Progress */}
        <circle
          className={cn("stroke-current transition-all duration-1000 ease-out", colorClass)}
          strokeWidth="12"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-5xl font-bold font-mono tracking-tighter", colorClass)}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Risk Score</span>
      </div>
    </div>
  );
}
