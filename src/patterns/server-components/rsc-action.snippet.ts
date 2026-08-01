// A Server Action: a function the client can call, that runs on the server.
"use server";

export async function renameMember(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));

  await db.member.update({ where: { id }, data: { name } });
  revalidatePath("/team");
}

// Used from a client component with no fetch, no route, no JSON:
//   <form action={renameMember}>
// which is the same <form action> API as the Actions pattern in this catalog.
