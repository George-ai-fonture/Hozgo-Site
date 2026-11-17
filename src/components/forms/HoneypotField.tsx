import type { UseFormRegisterReturn } from "react-hook-form";

/** Hidden from people and screen readers. Bots fill it, and the lead endpoint drops those. */
export function HoneypotField({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor="website-hp">Website</label>
      <input id="website-hp" type="text" tabIndex={-1} autoComplete="off" {...registration} name="website" />
    </div>
  );
}
