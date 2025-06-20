// src/useCurrentUser.ts
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { unauthorized } from "next/navigation";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
/**
 * Hook réutilisable pour vérifier l'état d'authentification
 * et s'assurer que l'utilisateur courant existe en base.
 */
export async function getRequiredUser() {
  const token = await convexAuthNextjsToken();
  if (!token) {
    unauthorized();
  }
  return token;
}
