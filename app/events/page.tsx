"use client"

import React from 'react'
import Link from 'next/link'
import { PlusCircle, Calendar, Search, Filter, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock data for demonstration
const events = [
  {
    id: 'hackathon',
    title: 'Annual Hackathon',
    description: 'A 48-hour coding challenge to build innovative solutions for real-world problems. Open to all skill levels.',
    image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-05-22T09:00:00Z',
    endDate: '2025-05-24T17:00:00Z',
    location: 'Technology Building, Room 201',
    organizerName: 'Computer Science Society',
    attendeesCount: 78,
    attending: true,
    category: 'Academic'
  },
  {
    id: 'career-fair',
    title: 'Spring Career Fair',
    description: 'Connect with over 50 employers from various industries offering internships and full-time positions.',
    image: 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-04-15T10:00:00Z',
    endDate: '2025-04-15T16:00:00Z',
    location: 'University Center, Grand Hall',
    organizerName: 'Career Services',
    attendeesCount: 356,
    attending: false,
    category: 'Career'
  },
  {
    id: 'end-of-term',
    title: 'End of Term Party',
    description: 'Celebrate the end of the semester with music, food, and activities. Open to all students.',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-05-15T20:00:00Z',
    endDate: '2025-05-16T02:00:00Z',
    location: 'Student Union, Ballroom',
    organizerName: 'Student Union',
    attendeesCount: 423,
    attending: true,
    category: 'Social'
  },
  {
    id: 'research-symposium',
    title: 'Undergraduate Research Symposium',
    description: 'Showcase your research projects and learn about groundbreaking work from peers across disciplines.',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-04-28T13:00:00Z',
    endDate: '2025-04-28T17:00:00Z',
    location: 'Science Center, Rooms 101-105',
    organizerName: 'Research Department',
    attendeesCount: 145,
    attending: false,
    category: 'Academic'
  },
  {
    id: 'basketball-final',
    title: 'Basketball Championship Final',
    description: 'Support our university team as they compete in the regional championship final!',
    image: 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-04-10T18:30:00Z',
    endDate: '2025-04-10T21:00:00Z',
    location: 'University Sports Center',
    organizerName: 'Athletics Department',
    attendeesCount: 892,
    attending: true,
    category: 'Sports'
  },
  {
    id: 'art-exhibition',
    title: 'Student Art Exhibition',
    description: 'Explore creative works from our talented art, design, and architecture students.',
    image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '2025-05-05T11:00:00Z',
    endDate: '2025-05-08T19:00:00Z',
    location: 'Arts Building, Gallery Space',
    organizerName: 'Fine Arts Department',
    attendeesCount: 267,
    attending: false,
    category: 'Arts & Culture'
  }
]

export default function EventsPage() {
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover what's happening on campus</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Event
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" className="gap-2 md:w-auto">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            All Events
          </TabsTrigger>
          <TabsTrigger value="attending" className="flex-1 sm:flex-none">
            Attending
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
            Upcoming
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-background/80">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-center">
                      <span className="text-xs uppercase text-muted-foreground">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="line-clamp-1 font-semibold group-hover:underline">
                        {event.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(event.endDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendeesCount} attending</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant={event.attending ? "outline" : "default"} 
                      className={cn(
                        "w-full",
                        event.attending && "border-primary text-primary"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle attendance toggle
                      }}
                    >
                      {event.attending ? "Attending" : "Attend"}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="attending" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.filter(event => event.attending).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
              >
                {/* Same content as above for attending events */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-background/80">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-center">
                      <span className="text-xs uppercase text-muted-foreground">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="line-clamp-1 font-semibold group-hover:underline">
                        {event.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(event.endDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendeesCount} attending</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      className="w-full border-primary text-primary"
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle attendance toggle
                      }}
                    >
                      Attending
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
              >
                {/* Same content as above for upcoming events */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-background/80">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-center">
                      <span className="text-xs uppercase text-muted-foreground">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="line-clamp-1 font-semibold group-hover:underline">
                        {event.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(event.endDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendeesCount} attending</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant={event.attending ? "outline" : "default"} 
                      className={cn(
                        "w-full",
                        event.attending && "border-primary text-primary"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle attendance toggle
                      }}
                    >
                      {event.attending ? "Attending" : "Attend"}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}