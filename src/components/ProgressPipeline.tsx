import { AnalysisStep } from "@/types/clip";
import { Loader2, Check } from "lucide-react";

const steps: { key: AnalysisStep; label: string }[] = [
  { key: "fetching", label: "Retrieving Video" },
  { key: "transcribing", label: "Transcribing" },
  { key: "analyzing", label: "Analyzing Content" },
  { key: "detecting", label: "Finding Best Moments" },
];

const stepOrder: AnalysisStep[] = ["fetching", "transcribing", "analyzing", "detecting"];

export function ProgressPipeline({ currentStep }: { currentStep: AnalysisStep }) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const isComplete = currentIndex > i;
          const isCurrent = currentIndex === i;

          return (
            <div key={s.key} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isComplete
                    ? "border-primary bg-primary"
                    : isCurrent
                    ? "border-primary shadow-glow animate-pulse"
                    : "border-muted"
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                )}
              </div>
              <span
                className={`text-xs font-medium text-center transition-colors ${
                  isComplete ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full gradient-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
