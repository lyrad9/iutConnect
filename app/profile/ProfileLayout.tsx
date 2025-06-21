"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, MailIcon, LinkIcon, PenSquare } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { ProfileFriends } from "@/app/profile/_components/profile-friends";
import { ProfilePhotos } from "@/app/profile/_components/profile-photos";
import { About } from "./_components/about";
import { EditProfileBtn } from "./_components/edit-profile-btn";
import EditProfilModal from "./_components/edit-profil-modal";
import UserInfo from "./_components/UserInfo";

export function ProfileLayout() {
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="space-y-6">
        <UserInfo />

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Publications</TabsTrigger>
            <TabsTrigger value="about">A propos</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6 space-y-6">
            {/*  {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))} */}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <About />
          </TabsContent>
        </Tabs>
      </div>
      <EditProfilModal />
    </div>
  );
}
