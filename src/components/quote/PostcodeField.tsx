import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, controlClass, describedBy } from "@/components/forms/Field";
import { lookupPostcodeDetailed, type PostcodeResult } from "@/lib/postcodes";
import { normalisePostcode } from "@/lib/validation";
import type { UseFormRegisterReturn } from "react-hook-form";

export type LookupStatus = "idle" | "loading" | "found" | "not_found" | "invalid" | "network";

interface PostcodeFieldProps {
  id: string;
  label: string;
  value: string;
  resolved: boolean;
  error?: string;
  registration: UseFormRegisterReturn;
  onResolved: (r: PostcodeResult) => void;
  onCleared: () => void;
}

const MESSAGES: Partial<Record<LookupStatus, string>> = {
  not_found: "Postcode not found",
  invalid: "Enter a full UK postcode, for example CV35 9EE",
  network: "We could not check that postcode just now. Try again.",
};

/** Postcode input with a Find button that resolves it on postcodes.io. */
export function PostcodeField({ id, label, value, resolved, error, registration, onResolved, onCleared }: PostcodeFieldProps) {
  const [status, setStatus] = useState<LookupStatus>("idle");

  async function find() {
    if (!value.trim()) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    const r = await lookupPostcodeDetailed(value);
    if (r.ok) {
      setStatus("found");
      onResolved(r.result);
    } else {
      setStatus(r.reason);
      onCleared();
    }
  }

  const lookupMessage = MESSAGES[status];
  const shownError = error ?? lookupMessage;

  return (
    <Field id={id} label={label} error={shownError}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={id}
            {...registration}
            onChange={(e) => {
              registration.onChange(e);
              if (resolved || status !== "idle") {
                setStatus("idle");
                onCleared();
              }
            }}
            onBlur={(e) => {
              registration.onBlur(e);
              const n = normalisePostcode(e.target.value);
              if (n !== e.target.value) {
                e.target.value = n;
                registration.onChange(e);
              }
              if (!resolved && n.length >= 5 && status === "idle") void find();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void find();
              }
            }}
            autoComplete="postal-code"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            className={`${controlClass} uppercase ${resolved ? "pr-10" : ""}`}
            {...describedBy(id, { error: shownError })}
          />
          {resolved && (
            <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success" aria-label="Postcode found" />
          )}
        </div>
        <Button type="button" variant="outline" className="h-11 px-5" onClick={() => void find()} disabled={status === "loading"}>
          {status === "loading" ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Find
        </Button>
      </div>
    </Field>
  );
}
