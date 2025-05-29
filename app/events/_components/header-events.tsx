import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
export default function HeaderEvents() {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold">Événements</h1>
        <p className="text-muted-foreground">
          Découvrez ce qui se passe sur le campus
        </p>
      </div>
      <Button className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Créer un événement
      </Button>
    </div>
  );
}
