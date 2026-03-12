import { AnalysisStep } from "@/types/clip";
import { Loader2, Check, Download, FileAudio, Brain, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const steps: { key: AnalysisStep; label: string; description: string; icon: React.ElementType }[] = [
  { key: "fetching", label: "Retrieving Video", description: "Downloading metadata & thumbnail", icon: Download },
  { key: "transcribing", label: "Transcribing", description: "Extracting transcript from captions", icon: FileAudio },
  { key: "analyzing", label: "AI Analysis", description: "Finding viral-worthy moments", icon: Brain },
  { key: "detecting", label: "Generating Clips", description: "Building clip candidates", icon: Target },
];

const stepOrder: AnalysisStep[] = ["fetching", "transcribing", "analyzing", "detecting"];

export function ProgressPipeline({ currentStep }: { currentStep: AnalysisStep }) {
  const currentIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentIndex + 0.5) / steps.length) * 100;

  return (
    <div className="w-full max-w-lg mx-auto py-6">
      {/* Current step highlight */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            {steps[currentIndex]?.description || "Processing..."}
          </span>
        </div>
      </motion.div>

      {/* Steps */}
      <div className="flex items-start justify-between gap-1">
        {steps.map((s, i) => {
          const isComplete = currentIndex > i;
          const isCurrent = currentIndex === i;
          const Icon = s.icon;

          return (
            <div key={s.key} className="flex flex-col items-center gap-2.5 flex-1">
              <motion.div
                initial={isCurrent ? { scale: 0.8 } : {}}
                animate={isCurrent ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isComplete
                    ? "gradient-primary shadow-glow"
                    : isCurrent
                    ? "border-2 border-primary bg-primary/10 shadow-glow animate-pulse-glow"
                    : "border border-border bg-muted/50"
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-muted-foreground/50" />
                )}
              </motion.div>
              <span
                className={`text-[11px] font-medium text-center leading-tight transition-colors ${
                  isComplete ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8 h-1.5 bg-muted/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Step counter */}
      <div className="mt-3 flex justify-between text-[10px] font-mono text-muted-foreground">
        <span>Step {currentIndex + 1} of {steps.length}</span>
        <span className="text-primary/70">
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
}
