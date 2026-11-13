import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import type { GuidePriceResponse } from "@/lib/guidePrice";
import { formatGbp } from "@/lib/guidePrice";
import { cn } from "@/lib/utils";

export type GuideState =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: GuidePriceResponse };

interface GuidePricePanelProps {
  state: GuideState;
  stale: boolean;
  onRefresh?: () => void;
  canRefresh?: boolean;
  className?: string;
}

function Row({ label, value, tone }: { label: string; value: number; tone?: "warn" }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4", tone === "warn" && "text-foreground")}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{formatGbp(value)}</dd>
    </div>
  );
}

export function GuidePricePanel({ state, stale, onRefresh, canRefresh, className }: GuidePricePanelProps) {
  return (
    <section
      aria-labelledby="guide-price-heading"
      aria-live="polite"
      aria-busy={state.status === "loading"}
      className={cn("card-elevated p-6", className)}
    >
      <p id="guide-price-heading" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Guide price, not a quote
      </p>

      {state.status === "empty" && (
        <p className="mt-4 text-sm text-muted-foreground">Enter both postcodes to see a guide price.</p>
      )}

      {state.status === "loading" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Working out the guide price
        </p>
      )}

      {state.status === "error" && (
        <div role="alert" className="mt-4 flex gap-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      )}

      {state.status === "ready" && <Ready data={state.data} stale={stale} onRefresh={onRefresh} canRefresh={canRefresh} />}

      <p className="mt-6 border-t pt-4 text-sm leading-relaxed text-muted-foreground">
        This is the price the app will show you, based on £1.50 a mile for the round trip with 20 base miles included, a
        minimum of £120, and an extra-horse fee. HOZGO Approved transporters accept at this price or send you their own
        offer. Your card is held, not charged, until the day of the trip.
      </p>
    </section>
  );
}

function Ready({
  data,
  stale,
  onRefresh,
  canRefresh,
}: {
  data: GuidePriceResponse;
  stale: boolean;
  onRefresh?: () => void;
  canRefresh?: boolean;
}) {
  const f = data.fare;
  const roundTrip = typeof data.pricingDistanceMiles === "number" ? data.pricingDistanceMiles : null;
  const adj = Number(f.pricingAdjustment ?? 0);
  const priority = Number(f.highPriorityFee ?? 0);
  const minimum = Number(f.minimumChargeFee ?? 0);
  return (
    <div className={cn("mt-3", stale && "opacity-60")}>
      {stale && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium">
          <span>Out of date, show again</span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={!canRefresh}
              className="inline-flex min-h-[44px] items-center gap-1 underline underline-offset-4 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Show again
            </button>
          )}
        </div>
      )}
      <p className="text-5xl font-bold tracking-tight tabular-nums">{formatGbp(f.total)}</p>
      {typeof data.distanceMiles === "number" && (
        <p className="mt-2 text-sm text-muted-foreground">{data.distanceMiles} miles each way</p>
      )}
      <dl className="mt-5 space-y-2 text-sm">
        <Row label="Base fee (20 miles)" value={f.baseFee} />
        <Row label={roundTrip !== null ? `Distance, there and back (${roundTrip} miles)` : "Distance"} value={f.distanceFee} />
        {Math.abs(adj) > 0.001 && <Row label="Pricing adjustment" value={adj} />}
        {f.additionalHorseFee > 0 && <Row label="Extra horses" value={f.additionalHorseFee} />}
        {f.outOfHoursFee > 0 && <Row label="Out of hours" value={f.outOfHoursFee} />}
        {f.onTheDayFee > 0 && <Row label="On the day" value={f.onTheDayFee} />}
        {priority > 0 && (
          <Row
            label={`Emergency surcharge${typeof data.highPriorityFeePercentage === "number" ? ` (${data.highPriorityFeePercentage}%)` : ""}`}
            value={priority}
          />
        )}
        {minimum > 0 && <Row label="Top-up to the £120 minimum" value={minimum} />}
        <div className="flex items-baseline justify-between gap-4 border-t pt-2 font-semibold">
          <dt>Guide price</dt>
          <dd className="tabular-nums">{formatGbp(f.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
