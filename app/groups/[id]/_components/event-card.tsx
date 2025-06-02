import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Users } from "lucide-react";
import Image from "next/image";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
}

export function EventCard({
  title,
  date,
  time,
  location,
  attendees,
  image,
}: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-32">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {date} • {time}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">{location}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          {attendees} participants
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Participer
        </Button>
      </CardFooter>
    </Card>
  );
}
