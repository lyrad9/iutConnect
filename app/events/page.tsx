import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  Calendar,
  Search,
  Filter,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { SearchBar } from "@/src/components/search/SearchBar";
import { Pagination } from "@/src/components/shared/pagination";
import { Suspense } from "react";
import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";
import EventCard from "./_components/event-card";
import HeaderEvents from "./_components/header-events";

// Créer un cache pour stocker les paramètres de recherche du côté serveur
const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(5),
});

// Mock data for demonstration
const events = [
  {
    id: 1,
    title: "End of Year Party",
    description:
      "Join us for the biggest party of the year to celebrate the end of the academic year.",
    date: "2024-05-15T18:00:00Z",
    endDate: "2024-05-15T23:00:00Z",
    location: "Student Union Building",
    category: "Social",
    image:
      "https://images.unsplash.com/photo-1496024840928-4c417adf211d?q=80&w=500&auto=format&fit=crop",
    attending: true,
    attendeesCount: 156,
  },
  {
    id: 2,
    title: "Tech Career Fair",
    description:
      "Meet representatives from top tech companies and explore career opportunities.",
    date: "2024-04-10T10:00:00Z",
    endDate: "2024-04-10T16:00:00Z",
    location: "Main Campus Hall",
    category: "Career",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500&auto=format&fit=crop",
    attending: false,
    attendeesCount: 423,
  },
  {
    id: 3,
    title: "Student Research Conference",
    description:
      "Annual conference showcasing outstanding student research projects across disciplines.",
    date: "2024-06-05T09:00:00Z",
    endDate: "2024-06-06T17:00:00Z",
    location: "Science Building Auditorium",
    category: "Academic",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop",
    attending: true,
    attendeesCount: 214,
  },
  {
    id: 4,
    title: "International Food Festival",
    description:
      "Taste dishes from around the world prepared by international student groups.",
    date: "2024-05-03T12:00:00Z",
    endDate: "2024-05-03T20:00:00Z",
    location: "Central Quad",
    category: "Cultural",
    image:
      "https://images.unsplash.com/photo-1533854980818-9f4629566638?q=80&w=500&auto=format&fit=crop",
    attending: false,
    attendeesCount: 531,
  },
  {
    id: 5,
    title: "Charity Sports Tournament",
    description:
      "Participate in various sports competitions to raise funds for local charities.",
    date: "2024-04-22T09:00:00Z",
    endDate: "2024-04-22T18:00:00Z",
    location: "University Sports Complex",
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=500&auto=format&fit=crop",
    attending: true,
    attendeesCount: 342,
  },
  {
    id: 6,
    title: "Alumni Networking Mixer",
    description:
      "Connect with successful alumni working in various industries.",
    date: "2024-05-25T17:00:00Z",
    endDate: "2024-05-25T20:00:00Z",
    location: "Business School Lounge",
    category: "Networking",
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=500&auto=format&fit=crop",
    attending: false,
    attendeesCount: 187,
  },
];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Analyser les paramètres de recherche pour obtenir des valeurs typées
  const { q, page, limit } = await searchParamsCache.parse(searchParams);

  // Filtrer les événements en fonction de la recherche
  const filteredEvents = events.filter(
    (event) => !q || event.title.toLowerCase().includes(q.toLowerCase())
  );

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedEvents = filteredEvents.slice(start, end);
  console.log("filteredEvents", filteredEvents);
  console.log("paginatedEvents", paginatedEvents);
  return (
    <div className="container px-4 py-6 md:py-8">
      <HeaderEvents />

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <Suspense
          fallback={
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8"
              />
            </div>
          }
        >
          <SearchBar />
        </Suspense>
        <Button variant="outline" className="gap-2 md:w-auto">
          <Filter className="size-4" />
          Filtrer
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            Tous les événements
          </TabsTrigger>
          <TabsTrigger value="attending" className="flex-1 sm:flex-none">
            Je participe
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
            À venir
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="mt-6">
              <Suspense>
                <Pagination totalItems={filteredEvents.length} />
              </Suspense>
            </div>
          ) : (
            <p className="text-center py-8">Aucun événement trouvé</p>
          )}
        </TabsContent>

        <TabsContent value="attending" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents
              .filter((event) => event.attending)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>

          {filteredEvents.filter((event) => event.attending).length > 0 ? (
            <div className="mt-6">
              <Suspense>
                <Pagination
                  totalItems={
                    filteredEvents.filter((event) => event.attending).length
                  }
                />
              </Suspense>
            </div>
          ) : (
            <p className="text-center py-8">
              Aucun événement auquel vous participez
            </p>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents
              .filter((event) => !event.attending)
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="mt-6">
              <Suspense>
                <Pagination totalItems={filteredEvents.length} />
              </Suspense>
            </div>
          ) : (
            <p className="text-center py-8">Aucun événement à venir</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
