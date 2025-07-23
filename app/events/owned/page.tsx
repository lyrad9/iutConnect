import { getRequiredUser } from "@/src/lib/auth-server";
import OwnedEventLayout from "./_components/OwnedEventLayout";

export default async function OwnedEventPage() {
  await getRequiredUser();
  return (
    <div className="px-4 py-6 md:py-8">
      <OwnedEventLayout />;
    </div>
  );
}

export const metadata = {
  title: "Mes Évènements",
  description: "Mes Évènements",
};
