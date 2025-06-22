import { Suspense } from "react";
import PendingRequestsList from "./_components/pending-requests-list";
import JoinedGroupsList from "./_components/joined-groups-list";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function JoinsPage() {
  return (
    <div className="container px-4 py-6 md:py-8 mx-auto">
      {/* En-tête avec titre */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Mes Groupes et Demandes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gérez vos demandes d&apos;adhésion et vos groupes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Section des groupes rejoints */}
        <div className="lg:col-span-8 space-y-6 pt-14">
          <JoinedGroupsList />
        </div>
        {/* Section des demandes en attente */}
        <div className="lg:col-span-4 space-y-6 pt-14">
          <PendingRequestsList />
        </div>
      </div>
    </div>
  );
}
