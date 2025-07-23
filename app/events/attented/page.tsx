import { getRequiredUser } from "@/src/lib/auth-server";
import AttentedEventLayout from "./AttentedEventLayout";
import { EventNavigation } from "../EventNavigation";

export default async function AttentedEventPage() {
  await getRequiredUser();
  return (
    <div className="px-4 py-6 md:py-8">
      <EventNavigation currentPage="attented" />
      <AttentedEventLayout />
    </div>
  );
}
export const metadata = {
  title: "Événements participés",
  description: "Événements participés",
};
