import React from "react";
import { PostCard } from "@/src/components/shared/post-card";
import { mockPosts } from "@/src/components/utils/const/mock-data";

export function NewsFeed() {
  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
