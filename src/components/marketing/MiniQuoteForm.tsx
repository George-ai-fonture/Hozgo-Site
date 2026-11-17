import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function today(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function MiniQuoteForm() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [horses, setHorses] = useState("1");
  const [date, setDate] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    params.set("horses", horses);
    if (date) params.set("date", date);
    navigate(`/quote?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="card-elevated space-y-4 p-6 sm:p-8" aria-labelledby="mini-quote-title">
      <h2 id="mini-quote-title" className="text-xl">
        See a guide price
      </h2>
      <div className="space-y-2">
        <Label htmlFor="mq-from">Collection postcode</Label>
        <Input id="mq-from" name="from" autoComplete="postal-code" placeholder="CV34 5AH" value={from} onChange={(e) => setFrom(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mq-to">Delivery postcode</Label>
        <Input id="mq-to" name="to" autoComplete="off" placeholder="SN8 1AA" value={to} onChange={(e) => setTo(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mq-horses">Horses</Label>
          <select id="mq-horses" name="horses" className={selectClass} value={horses} onChange={(e) => setHorses(e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mq-date">Preferred date</Label>
          <Input id="mq-date" name="date" type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full">
        Get a quote
        <ArrowRight aria-hidden="true" />
      </Button>
      <p className="text-xs text-muted-foreground">Guide price only. Booking and payment happen in the app.</p>
    </form>
  );
}
