import { getRequiredUser } from "@/src/lib/auth-server";
import OwnedEventLayout from "./_components/OwnedEventLayout";
import { EventNavigation } from "../EventNavigation";

export default async function OwnedEventPage() {
  await getRequiredUser();
  return (
    <div className="px-4 py-6 md:py-8 space-y-4">
      <EventNavigation currentPage="owned" />
      <OwnedEventLayout />
    </div>
  );
}

export const metadata = {
  title: "Mes évènements",
  description: "Evènements que vous avez créés ou où vous participez",
};
