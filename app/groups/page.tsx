import { getRequiredUser } from "@/src/lib/auth-server";
import NewFeedGroupsLayout from "./NewFeedGroupsLayout";

export default async function NewFeedGroupsPage() {
  await getRequiredUser();
  return (
    <div className="container px-4 py-6 md:py-8">
      <NewFeedGroupsLayout />
    </div>
  );
}
