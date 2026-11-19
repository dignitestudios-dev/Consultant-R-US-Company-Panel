import { Check, Circle } from "lucide-react";
import { PASSWORD_MIN, PASSWORD_RULES, getPasswordStrength } from "@/utils/password";

/** Requirements checklist (always shown) and strength bar (only once `showBar` is true). */
export function PasswordStrength({ value, showBar }: { value: string; showBar: boolean }) {
  const { score, max, color, met, lengthOk } = getPasswordStrength(value);
  const items = [
    { label: `At least ${PASSWORD_MIN} characters`, ok: lengthOk },
    ...PASSWORD_RULES.map((r, i) => ({ label: r.label, ok: met[i] })),
  ];

  return (
    <div className="space-y-2" aria-live="polite">
      {showBar && (
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(score / max) * 100}%`, backgroundColor: color }}
          />
        </div>
      )}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {items.map((it) => (
          <li
            key={it.label}
            className={`flex items-center gap-1.5 ${it.ok ? "text-success" : "text-muted-foreground"}`}
          >
            {it.ok ? <Check className="size-3" /> : <Circle className="size-3" />}
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
