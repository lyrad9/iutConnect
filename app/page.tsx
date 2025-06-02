import { Suspense } from "react";
import { NewsFeed } from "@/app/_components/news-feed";
import { FeedSkeleton } from "@/src/components/feed/feed-skeleton";
import { SuggestedUsers } from "@/app/_components/suggested-users";
import { WhatsHappening } from "@/app/_components/whats-happening";
import { CreatePostCard } from "@/src/components/shared/create-post-card";

export default function Home() {
  return (
    <div className="px-4">
      <div className="flex max-lg:flex-col gap-x-6">
        <div className="flex-1 lg:py-10">
          <CreatePostCard />
          <Suspense fallback={<FeedSkeleton />}>
            <NewsFeed />
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
