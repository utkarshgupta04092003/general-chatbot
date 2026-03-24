import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getServerSession() {
  const session = await auth();
  return session;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}
