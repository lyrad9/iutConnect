import { getRequiredUser } from "@/src/lib/auth-server";
import AttentedEventLayout from "./AttentedEventLayout";

export default async function AttentedEventPage() {
  await getRequiredUser();
  return (
    <div className="px-4 py-6 md:py-8">
      <AttentedEventLayout />;
    </div>
  );
}
