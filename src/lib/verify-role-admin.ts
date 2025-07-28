import { UserPermission, UserRole } from "@/convex/schema";
import { redirect } from "next/navigation";
export const hasDashboardAccess = (
  role: (typeof UserRole)[number],
  permissions: (typeof UserPermission)[number][]
) => {
  const isSuperAdmin = role === "SUPERADMIN";
  const isAdminWithAccess =
    role === "ADMIN" && permissions.includes("ACCESS_TO_DASHBOARD");
  if (!isSuperAdmin && !isAdminWithAccess) {
    return false;
  }
  return true;
};
