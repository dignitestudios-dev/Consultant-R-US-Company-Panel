import { z } from "zod";
import { COMPANY_SIZES, INDUSTRIES } from "@/utils/constants";
import { LIMITS } from "@/utils/validation";
import { DESCRIPTION_MAX, LINK_LIMITS } from "@/features/company/utils/company.utils";

const isHttpUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export const companySchema = z.object({
  companyName: z
    .string()
    .trim()
    .max(LIMITS.companyName, `Company name must be ${LIMITS.companyName} characters or fewer.`)
    .optional(),
  industryFocus: z.enum(INDUSTRIES as [string, ...string[]], { message: "Select an industry." }),
  companySize: z.enum(COMPANY_SIZES as [string, ...string[]], {
    message: "Select a company size.",
  }),
  description: z
    .string()
    .max(
      DESCRIPTION_MAX,
      `Description must be ${DESCRIPTION_MAX.toLocaleString("en-US")} characters or fewer.`,
    )
    .optional(),
  /** Related links, one per entry. Empty rows are ignored. */
  webUrls: z.array(z.string()).superRefine((links, ctx) => {
    const filled = links.filter((l) => l.trim());
    if (filled.length > LINK_LIMITS.maxCount) {
      ctx.addIssue({ code: "custom", message: `Add up to ${LINK_LIMITS.maxCount} links.` });
    }
    links.forEach((raw, i) => {
      const l = raw.trim();
      if (!l) return;
      if (l.length > LINK_LIMITS.maxLength) {
        ctx.addIssue({
          code: "custom",
          path: [i],
          message: `Each link must be ${LINK_LIMITS.maxLength.toLocaleString("en-US")} characters or fewer.`,
        });
      } else if (!isHttpUrl(l)) {
        ctx.addIssue({
          code: "custom",
          path: [i],
          message: "Enter a full link starting with http:// or https://",
        });
      }
    });
  }),
  country: z.string().trim().min(1),
  state: z.string().trim().min(1, "Select a state."),
  city: z.string().trim().min(1, "Select a city."),
});
