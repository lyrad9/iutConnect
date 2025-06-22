import { getRequiredUser } from "@/src/lib/auth-server";
import GroupsDiscoverLayout from "./GroupsDiscoverLayout";
export default async function GroupsDiscoverPage() {
  await getRequiredUser();

  return (
    <div className="container px-4 py-6 md:py-8">
      <GroupsDiscoverLayout />
    </div>
  );
}
