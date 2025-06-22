import { getRequiredUser } from "@/src/lib/auth-server";
import JoinsGroupsLayout from "./JoinGroupsLayout";

export default async function JoinsPage() {
  await getRequiredUser();
  return <JoinsGroupsLayout />;
}
