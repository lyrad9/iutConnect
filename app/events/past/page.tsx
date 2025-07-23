import React from "react";

export const metadata = {
  title: "Événements passés",
  description: "Historique des événements passés",
};

export default function PastEventsPage() {
  return (
    <div className="px-4 py-6 md:py-8 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Événements passés</h1>
        <p className="mt-2 text-muted-foreground">
          Historique des événements qui ont déjà eu lieu
        </p>
      </div>

      {/* Contenu sera implémenté plus tard */}
      <div className="py-12 text-center text-muted-foreground">
        Cette page est en cours d&apos;implémentation.
      </div>
    </div>
  );
}
