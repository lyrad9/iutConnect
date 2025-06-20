import { NotificationsManagement } from "@/app/admins/notifications/notifications-management";
import { getRequiredUser } from "@/src/lib/auth-server";

export default async function NotificationsPage() {
  const tokenUser = await getRequiredUser();

  return <NotificationsManagement />;
}
