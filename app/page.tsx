import { Suspense } from "react";

import { FeedSkeleton } from "@/src/components/feed/feed-skeleton";
import { SuggestedUsers } from "@/app/_components/suggested-users";
import { WhatsHappening } from "@/app/_components/whats-happening";
import { CreatePostCard } from "@/src/components/shared/create-post-card";
import { NewsPost } from "@/src/components/shared/post/news-posts";

export default function Home() {
  return (
<<<<<<< HEAD
    <div className="px-4">
      <div className="flex max-lg:flex-col gap-x-6">
        <div className="flex-1 lg:py-10">
=======
    <div className="container px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3">
>>>>>>> 647d777 (Revert "Refactorisation de la gestion des groupes et des publications, ajout de la fonctionnalité de favoris pour les publications, et amélioration de la validation des formulaires d'événements. Mise à jour des composants pour une meilleure expérience utilisateur et nettoyage du code.")
          <CreatePostCard />
          <Suspense fallback={<FeedSkeleton />}>
            <NewsPost />
            {/*  <NewsFeed /> */}
          </Suspense>
        </div>
        <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden pt-10 pb-24 hidden lg:flex overflow-y-auto items-stretch h-screen lg:w-96 w-full scrollbar-hide flex-col gap-y-8">
          <SuggestedUsers />
          <WhatsHappening />
        </div>
      </div>
    </div>
  );
}
