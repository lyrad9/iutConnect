import { getRequiredUser } from "@/src/lib/auth-server";
import UpcomingEventLayout from "./UpcomingEventsLayout";

export default async function UpcommingEventPage() {
  await getRequiredUser();
  return (
    <div className="px-4 py-6 md:py-8">
      <UpcomingEventLayout />
    </div>
  );
}
