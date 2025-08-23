"use client";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import Footer from "@/components/ui/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  CalendarDays,
  Ticket,
  Users,
  MapPinIcon,
  CalendarIcon,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

// Type definitions for the API response
interface AttendedEvent {
  event: {
    _id: string;
    name: string;
    tagline: string;
    location: string;
    image: string;
    date: string;
  };
  ticketType: string;
  quantityPurchased: number;
  datePurchased: string;
}

interface OrganizedEvent {
  _id: string;
  name: string;
  tagline: string;
  location: string;
  image: string;
  date: string;
  totalBookings: number;
  revenue: number;
}

interface MyEventsData {
  attendedEvents: AttendedEvent[];
  organizedEvents: OrganizedEvent[];
  stats: {
    totalAttended: number;
    totalOrganized: number;
    totalRevenue: number;
  };
}

// Empty placeholder data - will be replaced by API data
const emptyPlaceholderData: MyEventsData = {
  attendedEvents: [],
  organizedEvents: [],
  stats: {
    totalAttended: 0,
    totalOrganized: 0,
    totalRevenue: 0,
  },
};

// Custom EventCard for My Events - shows different buttons based on status
interface MyEventCardProps {
  id: string;
  name: string;
  tagline: string;
  location: string;
  image: string;
  date?: string;
  status: "attended" | "organized";
}

function MyEventCard({
  id,
  name,
  tagline,
  location,
  image,
  date = "Dec 15, 2024",
  status,
}: MyEventCardProps) {
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
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold">{name}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {tagline}
            </p>
          </div>
          <Badge variant={status === "attended" ? "secondary" : "default"}>
            {status === "attended" ? "Attended" : "Organized"}
          </Badge>
        </div>
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
        {status === "attended" ? (
          <>
            <Button disabled className="flex-1" variant="secondary">
              <CheckCircle className="w-4 h-4 mr-2" />
              Attended
            </Button>
            <Link href={`/events/${id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </>
        ) : (
          <Link href={`/events/${id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export default function MyEventsPage() {
  const { data: session } = useSession();
  const isOrganizer = session?.user?.isOrganizer || false;

  // State management
  const [myEventsData, setMyEventsData] =
    useState<MyEventsData>(emptyPlaceholderData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch my events data
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/get-my-events");

        if (response.data.success) {
          setMyEventsData(response.data.data);
        } else {
          setError("Failed to fetch events");
        }
      } catch (err: unknown) {
        console.error("Error fetching my events:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch events";
        setError(errorMessage);
        // Keep empty state on error
        setMyEventsData(emptyPlaceholderData);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchMyEvents();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />
      <main className="flex-1">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Events</h1>
            <p className="text-muted-foreground">
              {isOrganizer
                ? "Manage your attended and organized events"
                : "View all the events you've attended"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Events Attended
                </CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    myEventsData.stats.totalAttended
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total events attended
                </p>
              </CardContent>
            </Card>

            {isOrganizer && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Events Organized
                    </CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        myEventsData.stats.totalOrganized
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total events organized
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        `₹${myEventsData.stats.totalRevenue.toLocaleString()}`
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From organized events
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Events Content */}
          {isOrganizer ? (
            <Tabs defaultValue="attended" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="attended">Attended Events</TabsTrigger>
                <TabsTrigger value="organized">Organized Events</TabsTrigger>
              </TabsList>

              <TabsContent value="attended" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Events You&apos;ve Attended
                  </h2>
                  <Badge variant="secondary">
                    {myEventsData.attendedEvents.length} events
                  </Badge>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading your events...</span>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Error Loading Events
                    </h3>
                    <p className="text-gray-500 max-w-md">{error}</p>
                  </div>
                ) : myEventsData.attendedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myEventsData.attendedEvents.map((attendedEvent) => (
                      <div key={attendedEvent.event._id} className="relative">
                        <MyEventCard
                          id={attendedEvent.event._id}
                          name={attendedEvent.event.name}
                          tagline={attendedEvent.event.tagline}
                          location={attendedEvent.event.location}
                          image={attendedEvent.event.image}
                          date={formatDate(attendedEvent.event.date)}
                          status="attended"
                        />
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Ticket:</span>{" "}
                            {attendedEvent.ticketType}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Quantity:</span>{" "}
                            {attendedEvent.quantityPurchased}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Booked:</span>{" "}
                            {formatDate(attendedEvent.datePurchased)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4">🎟️</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Events Attended Yet
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      You haven&apos;t attended any events yet. Explore and book
                      your first event!
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="organized" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Events You&apos;ve Organized
                  </h2>
                  <Badge variant="secondary">
                    {myEventsData.organizedEvents.length} events
                  </Badge>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading your events...</span>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Error Loading Events
                    </h3>
                    <p className="text-gray-500 max-w-md">{error}</p>
                  </div>
                ) : myEventsData.organizedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myEventsData.organizedEvents.map((event) => (
                      <div key={event._id} className="relative">
                        <MyEventCard
                          id={event._id}
                          name={event.name}
                          tagline={event.tagline}
                          location={event.location}
                          image={event.image}
                          date={formatDate(event.date)}
                          status="organized"
                        />
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Bookings:</span>{" "}
                            {event.totalBookings}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Revenue:</span> ₹
                            {event.revenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Events Organized Yet
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      You haven&apos;t organized any events yet. Create your
                      first event to get started!
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            // Non-organizer view - only attended events
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Events You&apos;ve Attended
                </h2>
                <Badge variant="secondary">
                  {myEventsData.attendedEvents.length} events
                </Badge>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading your events...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Error Loading Events
                  </h3>
                  <p className="text-gray-500 max-w-md">{error}</p>
                </div>
              ) : myEventsData.attendedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEventsData.attendedEvents.map((attendedEvent) => (
                    <div key={attendedEvent.event._id} className="relative">
                      <MyEventCard
                        id={attendedEvent.event._id}
                        name={attendedEvent.event.name}
                        tagline={attendedEvent.event.tagline}
                        location={attendedEvent.event.location}
                        image={attendedEvent.event.image}
                        date={formatDate(attendedEvent.event.date)}
                        status="attended"
                      />
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Ticket:</span>{" "}
                          {attendedEvent.ticketType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Quantity:</span>{" "}
                          {attendedEvent.quantityPurchased}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Booked:</span>{" "}
                          {formatDate(attendedEvent.datePurchased)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-6xl mb-4">🎟️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Events Attended Yet
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    You haven&apos;t attended any events yet. Explore and book
                    your first event!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
