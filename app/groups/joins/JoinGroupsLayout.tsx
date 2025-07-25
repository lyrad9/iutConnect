"use client";
import PendingRequestsList from "./_components/pending-requests-list";
import JoinedGroupsList from "./_components/joined-groups-list";
import { HeaderGroupsEvents } from "@/src/components/layout/header-groups-events";

export default function JoinsGroupsLayout() {
  return (
    <div className="container px-4 py-6 md:py-8 mx-auto">
      {/* En-tête avec titre */}
      <HeaderGroupsEvents
        title="Mes Groupes et Demandes"
        description="Gérez vos demandes d'adhésion et vos groupes"
      />

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
