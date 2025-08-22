import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPinIcon, CalendarIcon } from "lucide-react";

interface EventCardProps {
  id: string;
  name: string;
  tagline: string;
  location: string;
  image: string;
  date?: string;
}

export default function EventCard({
  id,
  name,
  tagline,
  location,
  image,
  date = "Dec 15, 2024",
}: EventCardProps) {
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-2">
        <div className="relative h-48 w-full rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      <CardHeader className="pb-2 pt-0">
        <CardTitle className="line-clamp-2 text-lg font-semibold">
          {name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
          {tagline}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="flex-1">Book Now</Button>
        <Link href={`/events/${id}`}>
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
