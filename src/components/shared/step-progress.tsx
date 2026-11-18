/** Two-step progress bar for the signup flow. */
export function StepProgress({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        <span className="h-1 flex-1 rounded-full bg-gold" />
        <span className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-gold" : "bg-border"}`} />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-gold">Step {step} of 2</p>
    </div>
  );
}
