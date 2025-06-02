import React from "react";
import Link from "next/link";
import { PlusCircle, Users, Search, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { GroupCard } from "@/app/groups/group-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

// Mock data for demonstration
const groups = [
  {
    id: "cs-society",
    name: "Computer Science Society",
    description:
      "A community for CS students and enthusiasts to share knowledge, collaborate on projects, and stay updated on industry trends.",
    coverImage:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    logoImage:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    membersCount: 342,
    type: "Academic",
    joined: true,
  },
  {
    id: "photography-club",
    name: "Photography Club",
    description:
      "For anyone interested in photography, from beginners to experts. We organize photo walks, workshops, and exhibitions throughout the year.",
    coverImage:
      "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    logoImage:
      "https://images.pexels.com/photos/212372/pexels-photo-212372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    membersCount: 187,
    type: "Club",
    joined: false,
  },
  {
    id: "student-union",
    name: "Student Union",
    description:
      "The official student representative body advocating for student rights and organizing campus-wide events and initiatives.",
    coverImage:
      "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    logoImage:
      "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    membersCount: 1245,
    type: "Organization",
    joined: true,
  },
  {
    id: "basketball-team",
    name: "University Basketball Team",
    description:
      "The official basketball team representing our university in intercollegiate tournaments and championships.",
    coverImage:
      "https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    logoImage:
      "https://images.pexels.com/photos/2820902/pexels-photo-2820902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    membersCount: 32,
    type: "Sports",
    joined: false,
  },
  {
    id: "debate-society",
    name: "Debate Society",
    description:
      "We foster critical thinking and public speaking skills through regular debates on diverse topics and participation in competitions.",

    coverImage:
      "https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    logoImage:
      "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    membersCount: 76,
    type: "Academic",
    joined: true,
  },
  {
    id: "film-club",
    name: "Film Club",
    description:
      "For movie lovers and aspiring filmmakers. We screen films, discuss cinema, and create our own short films together.",
    coverImage:
      "https://images.pexels.com/photos/7991189/pexels-photo-7991189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    logoImage:
      "https://images.pexels.com/photos/7991438/pexels-photo-7991438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    membersCount: 123,
    type: "Club",
    joined: false,
  },
];
export default function GroupLayout() {
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Discover and join university communities
          </p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="size-4" />
          Create Group
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" className="gap-2 md:w-auto">
          <Filter className="size-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            All Groups
          </TabsTrigger>
          <TabsTrigger value="my-groups" className="flex-1 sm:flex-none">
            My Groups
          </TabsTrigger>
          <TabsTrigger value="suggested" className="flex-1 sm:flex-none">
            Suggested
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups
              .filter((group) => group.joined)
              .map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="suggested" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups
              .filter((group) => !group.joined)
              .map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
