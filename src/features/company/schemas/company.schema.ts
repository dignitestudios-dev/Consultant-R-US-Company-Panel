import { z } from "zod";
import { COMPANY_SIZES, INDUSTRIES } from "@/utils/constants";
import { splitLines } from "@/features/company/utils/company.utils";

const urlLine = z
  .string()
  .max(250, "Each URL must be 250 characters or fewer.")
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter full URLs starting with http:// or https://");

export const companySchema = z.object({
  companyName: z.string().trim().optional(),
  industryFocus: z.enum(INDUSTRIES as [string, ...string[]], { message: "Select an industry." }),
  companySize: z.enum(COMPANY_SIZES as [string, ...string[]], {
    message: "Select a company size.",
  }),
  description: z.string().max(1000, "Keep it under 1000 characters.").optional(),
  /** One URL per line. */
  webUrls: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      for (const line of splitLines(val)) {
        const r = urlLine.safeParse(line);
        if (!r.success) {
          ctx.addIssue({ code: "custom", message: r.error.issues[0].message });
          return;
        }
      }
    }),
  country: z.string().trim().min(1),
  state: z.string().trim().min(1, "Select a state."),
  city: z.string().trim().min(1, "Select a city."),
});
