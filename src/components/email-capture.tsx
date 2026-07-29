"use client";

import { useState } from "react";

/**
 * Email capture. No provider is wired yet — the form accepts the address
 * and thanks the reader, so the layout and copy are real while the
 * newsletter backend is chosen. Swap the submit handler for the provider
 * API route when one exists.
 */
export function EmailCapture({
  cta,
  compact = false,
}: {
  cta: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="font-mono text-[12px] text-accent-300">
        Filed. Watch your inbox — first one arrives this week.
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setDone(true);
  };

  return (
    <form
      onSubmit={submit}
      className={compact ? "flex flex-col gap-2" : "flex gap-2.5"}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="min-w-0 flex-1 rounded-sm border border-neutral-700 bg-bg px-3 py-[11px] text-sm text-ink placeholder:text-neutral-600"
      />
      <button
        type="submit"
        className="cursor-pointer whitespace-nowrap rounded-sm border border-accent bg-accent-900 px-4 py-[11px] text-sm text-accent-100 transition-colors duration-150 hover:bg-accent-800"
      >
        {cta}
      </button>
    </form>
  );
}
