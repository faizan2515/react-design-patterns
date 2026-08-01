import { useState } from "react";
import { Knobs } from "../../lab/Knobs";

/**
 * Adapter: translate a foreign shape into the one your code already speaks.
 *
 * Two providers, two payloads, neither matching what the UI wants. The adapters absorb the
 * differences — a full name split in two, a timestamp in seconds instead of milliseconds,
 * a status spelled differently — so exactly one component renders both.
 *
 * The discipline is to define the target shape first, from what the UI needs. Let the
 * payload define it instead and every provider quirk becomes permanent.
 */
interface Payment {
  id: string;
  payer: string;
  amount: number;
  paidAt: Date;
  status: "paid" | "pending" | "failed";
}

interface StripeCharge {
  id: string;
  customer: { first_name: string; last_name: string };
  amount_cents: number;
  created: number; // seconds
  outcome: "succeeded" | "processing" | "declined";
}

interface PaypalTxn {
  transaction_id: string;
  payer_name: string;
  gross: string; // decimal string
  time_iso: string;
  state: "COMPLETED" | "PENDING" | "DENIED";
}

function fromStripe(charge: StripeCharge): Payment {
  return {
    id: charge.id,
    payer: `${charge.customer.first_name} ${charge.customer.last_name}`,
    amount: charge.amount_cents / 100,
    paidAt: new Date(charge.created * 1000),
    status:
      charge.outcome === "succeeded"
        ? "paid"
        : charge.outcome === "processing"
          ? "pending"
          : "failed",
  };
}

function fromPaypal(txn: PaypalTxn): Payment {
  return {
    id: txn.transaction_id,
    payer: txn.payer_name,
    amount: Number(txn.gross),
    paidAt: new Date(txn.time_iso),
    status:
      txn.state === "COMPLETED"
        ? "paid"
        : txn.state === "PENDING"
          ? "pending"
          : "failed",
  };
}

const STRIPE: StripeCharge[] = [
  {
    id: "ch_1",
    customer: { first_name: "Ada", last_name: "Lovelace" },
    amount_cents: 12900,
    created: 1_735_689_600,
    outcome: "succeeded",
  },
  {
    id: "ch_2",
    customer: { first_name: "Alan", last_name: "Turing" },
    amount_cents: 4250,
    created: 1_735_776_000,
    outcome: "processing",
  },
];

const PAYPAL: PaypalTxn[] = [
  {
    transaction_id: "PP-88",
    payer_name: "Grace Hopper",
    gross: "84.00",
    time_iso: "2025-01-02T10:15:00Z",
    state: "COMPLETED",
  },
  {
    transaction_id: "PP-89",
    payer_name: "Susan Kare",
    gross: "32.50",
    time_iso: "2025-01-03T09:00:00Z",
    state: "DENIED",
  },
];

export default function Demo() {
  const [provider, setProvider] = useState<"stripe" | "paypal">("stripe");

  const payments: Payment[] =
    provider === "stripe" ? STRIPE.map(fromStripe) : PAYPAL.map(fromPaypal);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Provider"
          value={provider}
          onChange={setProvider}
          options={[
            { value: "stripe", label: "Stripe-ish" },
            { value: "paypal", label: "PayPal-ish" },
          ]}
        />
      </Knobs>

      <PaymentTable payments={payments} />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        One table, two providers whose payloads agree on nothing — names split or joined,
        amounts in cents or decimal strings, timestamps in seconds or ISO, three different
        spellings of “failed”. The adapters absorb all of it, and{" "}
        <code className="text-fg">PaymentTable</code> has never heard of either.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Define the target shape from what the UI needs, then write adapters towards it. Do
        it the other way round and the first provider's quirks become your permanent
        internal vocabulary — which is how apps end up with{" "}
        <code className="text-fg">amount_cents</code> in component props years after
        leaving that provider.
      </p>
    </div>
  );
}

function PaymentTable({ payments }: { payments: Payment[] }) {
  return (
    <ul className="divide-y divide-line rounded-md border border-line">
      {payments.map((payment) => (
        <li key={payment.id} className="flex items-center gap-3 px-3 py-2">
          <span className="flex-1 text-[13px] text-fg">{payment.payer}</span>
          <span className="font-mono text-[12px] tabular-nums text-muted">
            £{payment.amount.toFixed(2)}
          </span>
          <span className="font-mono text-[10px] text-muted">
            {payment.paidAt.toISOString().slice(0, 10)}
          </span>
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
              payment.status === "paid"
                ? "bg-accent-soft text-accent"
                : "text-muted"
            }`}
          >
            {payment.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
