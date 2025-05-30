import React from "react";
import { mockPosts } from "@/src/components/utils/const/mock-data";

export function ProfilePhotos() {
  // Extract all media from posts
  const allMedia = mockPosts.flatMap((post) => post.media || []);

  return (
    <div className="mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Photos</h2>
        <p className="text-sm text-muted-foreground">
          Photos you&apos;ve shared or been tagged in
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {allMedia.map((media, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-md"
          >
            <img
              src={media.url}
              alt="Photo"
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
