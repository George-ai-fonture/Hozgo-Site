import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import { LEAD_FAILURE_MESSAGE } from "@/lib/leads";

/** Shown when a lead could not be sent. Gives the visitor a pre-filled email instead. */
export function SubmitError({ mailto }: { mailto: string }) {
  const [before, after] = LEAD_FAILURE_MESSAGE.split(CONTACT_EMAIL);
  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
      <div className="space-y-2">
        <p>
          {before}
          <a href={mailto} className="font-semibold underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          {after}
        </p>
        <p>
          <a href={mailto} className="font-medium underline underline-offset-4">
            Open an email with your answers filled in
          </a>
        </p>
      </div>
    </div>
  );
}

export function SubmitSuccess({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="status" className="card-elevated space-y-4 p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-success" aria-hidden="true" />
        <h2 className="text-2xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}
