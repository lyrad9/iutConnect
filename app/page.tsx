import { Suspense } from "react";

import { FeedSkeleton } from "@/src/components/feed/feed-skeleton";
import { SuggestedUsers } from "@/app/_components/suggested-users";
import { WhatsHappening } from "@/app/_components/whats-happening";
import { CreatePostCard } from "@/src/components/shared/create-post-card";
import { NewsPost } from "@/src/components/shared/post/news-posts";

export default function Home() {
  return (
    <div className="px-4">
      <div className="flex max-lg:flex-col gap-x-6">
        <div className="flex-1 py-10">
          <CreatePostCard />

          <NewsPost />
          {/*  <NewsFeed /> */}
        </div>
        <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden pt-10 pb-24 hidden lg:flex overflow-y-auto items-stretch h-screen lg:w-96 w-full scrollbar-hide flex-col gap-y-8">
          {/*   <SuggestedUsers /> */}
          <WhatsHappening />
        </div>
      </div>
    </div>
  );
}
