"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CreatePostCard } from "@/src/components/shared/create-post-card";
import { PostCard } from "@/src/components/shared/post/post-card";
import { EmptyState } from "@/src/components/ui/empty-state";
import { MessageSquare, Loader2 } from "lucide-react";
import GroupFeed from "@/src/components/groups/group-feed";

type DiscussionsTabProps = {
  groupId: Id<"forums">;
  profilImageGroup?: string;
};

/**
 * Onglet "Discussions" pour afficher les publications du groupe
 */
export function DiscussionsTab({
  groupId,
  profilImageGroup,
}: DiscussionsTabProps) {
  return (
    <div className="space-y-6">
      {/* Zone de création de post */}
      <CreatePostCard
        groupId={groupId}
        profilImageGroup={profilImageGroup}
        placeholder="Partagez quelque chose avec votre groupe..."
        showEventButton={true}
      />

      {/* Liste des posts */}
      <GroupFeed groupId={groupId} />
    </div>
  );
}
