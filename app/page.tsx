import { Suspense } from "react";
import { NewsFeed } from "@/app/_components/news-feed";
import { FeedSkeleton } from "@/src/components/feed/feed-skeleton";
import { SuggestedUsers } from "@/app/_components/suggested-users";
import { WhatsHappening } from "@/app/_components/whats-happening";
import { CreatePostCard } from "@/src/components/shared/create-post-card";

export default function Home() {
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3">
          <CreatePostCard />
          <Suspense fallback={<FeedSkeleton />}>
            <NewsFeed />
          </Suspense>
        </div>
        <div className="hidden space-y-6 md:block">
          <SuggestedUsers />
          <WhatsHappening />
        </div>
      </div>
    </div>
  );
}
