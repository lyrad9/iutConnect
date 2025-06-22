import { useQuery } from "convex/react";
import { MultiAvatar } from "../ui/multi-avatar";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
/**
 * Composant pour afficher les membres d'un groupe avec MultiAvatar
 */
type typeMembers = {
  id: string;
  name?: string;
  avatar?: string | null;
};
export function GroupMembersAvatars({
  groupId,
  membersCount,
}: {
  groupId: string;
  membersCount: number;
}) {
  const [members, setMembers] = useState<
    { id: string; name?: string; avatar?: string | null }[]
  >([]);

  // Récupérer les membres du groupe
  const groupMembers = useQuery(api.users.getGroupMembers, {
    groupId: groupId as Id<"forums">,
    limit: 5,
  });

  useEffect(() => {
    if (groupMembers?.members) {
      setMembers(groupMembers.members.filter((member) => member !== null));
    }
  }, [groupMembers]);

  if (!members.length) {
    return null;
  }

  return (
    <MultiAvatar
      users={members}
      totalCount={membersCount}
      maxDisplayed={5}
      size="lg"
      className="mt-1"
    />
  );
}
