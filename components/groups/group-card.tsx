"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Users, MoreHorizontal } from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

interface GroupCardProps {
  group: {
    id: string
    name: string
    description: string
    coverImage: string
    logoImage: string
    membersCount: number
    type: string
    joined: boolean
  }
}

export function GroupCard({ group }: GroupCardProps) {
  const [isJoined, setIsJoined] = useState(group.joined)
  const [memberCount, setMemberCount] = useState(group.membersCount)
  const { toast } = useToast()
  
  const handleJoinLeave = () => {
    if (isJoined) {
      setIsJoined(false)
      setMemberCount((prev) => prev - 1)
      
      toast({
        title: "Left group",
        description: `You have left ${group.name}`,
      })
    } else {
      setIsJoined(true)
      setMemberCount((prev) => prev + 1)
      
      toast({
        title: "Joined group",
        description: `You have joined ${group.name}`,
      })
    }
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-36">
        <img 
          src={group.coverImage} 
          alt={`${group.name} cover`} 
          className="h-full w-full object-cover"
        />
        <div className="absolute -bottom-10 left-4 h-20 w-20 overflow-hidden rounded-xl border-4 border-background bg-background">
          <img 
            src={group.logoImage} 
            alt={`${group.name} logo`} 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      
      <CardHeader className="pt-12">
        <div className="flex items-start justify-between">
          <div>
            <Link 
              href={`/groups/${group.id}`} 
              className="text-xl font-semibold hover:underline"
            >
              {group.name}
            </Link>
            <CardDescription className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{memberCount} members</span>
              <span className="mx-1">•</span>
              <span>{group.type}</span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Group</DropdownMenuItem>
              <DropdownMenuItem>Share Group</DropdownMenuItem>
              <DropdownMenuItem>Report Group</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {group.description}
        </p>
      </CardContent>
      
      <CardFooter>
        <div className="flex w-full gap-2">
          <Button 
            variant={isJoined ? "outline" : "default"}
            className="flex-1"
            onClick={handleJoinLeave}
          >
            {isJoined ? "Leave" : "Join"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/groups/${group.id}`}>
              View
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}