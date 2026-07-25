import { z } from "zod";

/**
 * Shared client/server validation for the Private Inquiry form.
 * Server-side use is authoritative (§2a) — never trust the client.
 */

// Strip control characters (keep \n and \t in multi-line text).
function clean(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

const shortText = (max: number) =>
  z.string().transform(clean).pipe(z.string().min(1, "Required").max(max, "Too long"));

export const inquirySchema = z.object({
  firstName: shortText(100),
  lastName: shortText(100),
  email: z
    .string()
    .transform(clean)
    .pipe(z.email("Enter a valid email address").max(254, "Too long")),
  phone: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .max(40, "Too long")
        .regex(/^[0-9+()\-.\s]*$/, "Enter a valid phone number")
    )
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z
    .string()
    .transform(clean)
    .pipe(z.string().min(10, "Please include a brief message").max(5000, "Too long")),
  // Honeypot — must be empty. Real users never see this field.
  company: z.string().max(0).optional().default(""),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;
