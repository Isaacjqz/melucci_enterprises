"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { inquirySchema, type InquiryInput } from "@/lib/inquiry";
import { site } from "@/content/site";

/**
 * Client-side validation mirrors the server (same Zod schema); the server
 * remains authoritative. Minimal custom resolver instead of
 * @hookform/resolvers (broken transitive peer deps at install time).
 */
const zodResolver: Resolver<InquiryInput> = async (values) => {
  const result = inquirySchema.safeParse(values);
  if (result.success) return { values, errors: {} };
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "root");
    if (!errors[key]) errors[key] = { type: issue.code, message: issue.message };
  }
  return { values: {}, errors };
};

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full border border-hairline bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-brass-ink";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      company: "",
    },
    resolver: zodResolver,
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setServerError(
          data.error ?? "Your inquiry could not be sent. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setServerError("Your inquiry could not be sent. Please try again.");
    }
  });

  const fieldError = (name: keyof InquiryInput) =>
    errors[name] ? (
      <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-brass-ink">
        {errors[name]?.message as string}
      </p>
    ) : null;

  const describedBy = (name: keyof InquiryInput) =>
    errors[name] ? `${name}-error` : undefined;

  if (status === "success") {
    return (
      <div aria-live="polite" className="border border-hairline bg-paper-alt p-8">
        <p className="font-serif text-xl text-ink">Thank you.</p>
        <p className="mt-3 text-ink-muted">
          Your inquiry has been received and will be reviewed with discretion.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Private inquiry form">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-ink">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            aria-describedby={describedBy("firstName")}
            className={inputClasses}
            {...register("firstName")}
          />
          {fieldError("firstName")}
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-ink">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            aria-describedby={describedBy("lastName")}
            className={inputClasses}
            {...register("lastName")}
          />
          {fieldError("lastName")}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
            Email <span aria-hidden="true" className="text-brass-ink">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={inputClasses}
            {...register("email")}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">
            Phone <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            className={inputClasses}
            {...register("phone")}
          />
          {fieldError("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
            Message <span aria-hidden="true" className="text-brass-ink">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="message"
            rows={6}
            required
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
            className={inputClasses}
            {...register("message")}
          />
          {fieldError("message")}
        </div>
      </div>

      {/* Honeypot — hidden from real users and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <p className="mt-6 text-sm text-ink-muted">{site.inquiry.note}</p>

      <div aria-live="assertive" className="mt-4">
        {status === "error" && serverError ? (
          <p role="alert" className="text-sm text-brass-ink">
            {serverError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex items-center gap-2 bg-ink px-8 py-3 text-sm font-medium tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Submit inquiry"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
