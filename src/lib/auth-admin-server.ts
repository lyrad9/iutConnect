import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { unauthorized } from "next/navigation";

export async function getRequiredAdmin() {
  const token = await convexAuthNextjsToken();
  if (!token) {
    unauthorized();
  }
  const user = await preloadQuery(api.users.currentUser, {}, { token });
  if (!user) {
    unauthorized();
  }
  return user;
}
