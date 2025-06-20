import EditProfilUserModalProvider from "@/src/providers/EditProfilUserModalProvider";
import { ProfileLayout } from "./ProfileLayout";
import { getRequiredUser } from "@/src/lib/auth-server";
import EditProfilModal from "./_components/edit-profil-modal";

export default async function ProfilePage() {
  await getRequiredUser(); // Ensure user is authenticated

  return (
    <EditProfilUserModalProvider>
      <ProfileLayout />
      <EditProfilModal />
    </EditProfilUserModalProvider>
  );
}
