"use client";
// Everything below this directive is bundled for the browser, including
// what it imports. The directive marks a boundary, not a file.
import { useState } from "react";

export function InviteButton({ memberId }: { memberId: string }) {
  const [sent, setSent] = useState(false);

  return (
    <button onClick={() => setSent(true)} disabled={sent}>
      {sent ? "Invited" : "Invite"}
    </button>
  );
}
