import { Dashboard } from "@/src/components/admin/dashboard";
import { getRequiredAdmin } from "@/src/lib/auth-admin-server";
export default async function AdminPage() {
  const preloadedUser = await getRequiredAdmin();
  return <Dashboard user={preloadedUser} />;
}
