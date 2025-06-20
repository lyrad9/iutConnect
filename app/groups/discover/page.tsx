import { getRequiredUser } from "@/src/lib/auth-server";
import GroupsDiscoverLayout from "./GroupsDiscoverLayout";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { EmptyState } from "@/src/components/ui/empty-state";
import { FileQuestion } from "lucide-react";
export default async function GroupsDiscoverPage() {
  await getRequiredUser();

  return (
    <div className="container px-4 py-6 md:py-8">
      <GroupsDiscoverLayout />
    </div>
  );
}
