// app/team/page.tsx — a Server Component (the default in an RSC framework)
import { db } from "@/lib/db";
import { InviteButton } from "./InviteButton";

export default async function TeamPage() {
  // Runs on the server. No effect, no loading state, no API route in between —
  // and this query never reaches the browser bundle.
  const members = await db.member.findMany();

  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>
          {member.name}
          {/* Crossing into the client. Only this subtree ships JS. */}
          <InviteButton memberId={member.id} />
        </li>
      ))}
    </ul>
  );
}
