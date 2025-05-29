"use client"

import React from 'react'
import Link from 'next/link'
import { Calendar, MapPin, MailIcon, LinkIcon, PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockUsers, mockPosts } from '@/lib/mock-data'
import { PostCard } from '@/components/feed/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProfileFriends } from '@/components/profile/profile-friends'
import { ProfilePhotos } from '@/components/profile/profile-photos'

export default function ProfilePage() {
  // Using the first user from mock data for demonstration
  const user = mockUsers[0]
  const userPosts = mockPosts.filter(post => post.author.id === user.id)
  
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="space-y-6">
        {/* Cover and Profile */}
        <div className="relative rounded-xl bg-muted">
          <div className="h-48 overflow-hidden rounded-t-xl md:h-64">
            <img 
              src="https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Cover" 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="p-4">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div className="flex items-end">
                <div className="relative -mt-20 mr-4">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.verified && (
                    <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>University of Technology</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{user.department}, Year {user.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MailIcon className="h-4 w-4" />
                      <span>{user.name.toLowerCase().replace(' ', '.')}@unimail.edu</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a href="#" className="text-primary hover:underline">portfolio.site</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex w-full gap-2 md:w-auto">
                <Button variant="outline" className="flex-1 gap-2 md:flex-none" asChild>
                  <Link href="/settings">
                    <PenSquare className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button className="flex-1 md:flex-none">+ Follow</Button>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm">{user.bio}</p>
            </div>
            
            <div className="mt-6 flex gap-6 border-b pb-1">
              <div className="text-center">
                <div className="font-semibold">246</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">1.5k</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">578</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6 space-y-6">
            {userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>
          <TabsContent value="friends">
            <ProfileFriends />
          </TabsContent>
          <TabsContent value="photos">
            <ProfilePhotos />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}