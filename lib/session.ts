import { auth } from "./auth";
import { redirect } from "next/navigation";
import { type Session } from "next-auth";

export async function getServerSession() {
  const session = await auth();
  return session;
}

export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session as Session;
}
