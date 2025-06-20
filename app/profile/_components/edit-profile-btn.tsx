import { Button } from "@/src/components/ui/button";
import { useEditProfilUserModal } from "@/src/hooks/edit-profil.modal.store";
import { Pencil, PenSquare } from "lucide-react";

export function EditProfileBtn() {
  const { setOpen } = useEditProfilUserModal();
  return (
    <div className="flex w-full gap-2 md:w-auto">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="flex-1 gap-2 md:flex-none"
      >
        <Pencil className="size-4" />
        Modifier le profil
      </Button>
    </div>
  );
}
