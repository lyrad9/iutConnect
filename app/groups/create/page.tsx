import { getRequiredUser } from "@/src/lib/auth-server";
import GroupCreateLayout from "./GroupCreateLayout";

export default async function CreatePage() {
  await getRequiredUser();
  return (
    <div className="container px-4 py-6 md:py-8">
      <GroupCreateLayout />
    </div>
  );
}
