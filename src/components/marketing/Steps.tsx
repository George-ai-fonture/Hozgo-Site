import type { ReactNode } from "react";

export interface Step {
  n: string;
  name: string;
  short: string;
  long?: ReactNode;
}

export const STEPS: Step[] = [
  {
    n: "01",
    name: "ROUTE",
    short: "Enter your collection and delivery postcodes, your date and how many horses are travelling.",
    long: (
      <>
        <p>Start with the journey. Collection postcode, delivery postcode, the date you want and how many horses are travelling.</p>
        <p>You can begin on this website. It collects your journey and shows a guide price. Booking and payment happen in the app.</p>
      </>
    ),
  },
  {
    n: "02",
    name: "AMOUNT",
    short: "Your guide price comes back in seconds. Accept it in the app and that is the price your job goes out at.",
    long: (
      <>
        <p>Your guide price comes back in seconds. No call-backs. No waiting for quotes.</p>
        <p>Accept it in the app and that is the price your job goes out at.</p>
      </>
    ),
  },
  {
    n: "03",
    name: "MONEY HELD",
    short: "A hold is placed on your card. It is charged on the day of the trip, not before.",
    long: (
      <>
        <p>A hold is placed on your card when you book. It is not a payment. The money stays with you.</p>
        <p>It is charged on the day of the trip. If no transporter takes your job, the hold is released.</p>
      </>
    ),
  },
  {
    n: "04",
    name: "PICKED UP",
    short:
      "Your job goes to HOZGO Approved transporters. The first to accept at your price takes it. If none can, they send you offers and you choose.",
    long: (
      <>
        <p>Your job goes to HOZGO Approved transporters only. The first to accept at your price takes it.</p>
        <p>If none can, they send you offers and you choose. The contract is signed in the app, and your horse travels.</p>
      </>
    ),
  },
];

export function Steps({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={detailed ? "space-y-6" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"}>
      {STEPS.map((s) => (
        <li key={s.n} className={detailed ? "card-premium flex gap-5 p-6 sm:p-8" : "card-premium p-6"}>
          <span className="text-3xl font-semibold text-gunmetal-300" aria-hidden="true">
            {s.n}
          </span>
          <div className="min-w-0">
            <h3 className="text-lg tracking-wide">
              <span className="sr-only">Step {Number(s.n)}: </span>
              {s.name}
            </h3>
            {detailed ? (
              <div className="mt-3 space-y-3 text-muted-foreground">{s.long}</div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{s.short}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
