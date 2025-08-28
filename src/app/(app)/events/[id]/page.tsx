"use client";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Event {
  _id: string;
  organizer: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  image: string;
  dateStarted: string;
  dateEnded: string;
  status: string;
  ticketTypes: { name: string; price: number; quantity: number }[];
}

async function getEventDetails(id: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const data = await axios.get(`${baseUrl}/api/events/${id}`);
    if (!data.status || data.status >= 400) {
      throw new Error(`Failed to fetch events: ${data.status}`);
    }
    return data.data.event;
  } catch (error) {
    return null;
  }
}

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [event, setEvent] = React.useState<Event | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!id) return; // Guard clause for undefined id

    const fetchEvent = async () => {
      const eventData = await getEventDetails(id);
      setEvent(eventData);
    };

    fetchEvent();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      {session ? <DashboardNavbar /> : <Navbar />}
      <main className="flex-1">
        <div className="container mx-auto p-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Event Image */}
              <div className="w-full">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={event?.image || "/images/hero.jpg"}
                    alt={event?.name || "Event Image"}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Event Info Card - moved here for lg screens */}
              <div className="hidden lg:block">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p className="text-muted-foreground">
                          {event?.dateStarted && event?.dateEnded
                            ? `${new Date(event.dateStarted).toLocaleDateString()} - ${new Date(event.dateEnded).toLocaleDateString()}`
                            : "March 15, 2025 - March 17, 2025"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {event?.dateStarted
                            ? `${new Date(event.dateStarted).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.dateEnded).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                            : "9:00 AM - 6:00 PM"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {event?.location || "Convention Center, New York"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Organizer</p>
                        <p className="text-muted-foreground">
                          Tech Events Inc.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Event Details */}
            <div className="space-y-6">
              {/* Event Title and Status */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{event?.status || "Open"}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {event?.name || "Tech Conference 2025"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {event?.tagline ||
                    "Join us for the most exciting technology conference of the year"}
                </p>
              </div>

              {/* Event Info - visible on smaller screens */}
              <Card className="lg:hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-muted-foreground">
                        {event?.dateStarted && event?.dateEnded
                          ? `${new Date(event.dateStarted).toLocaleDateString()} - ${new Date(event.dateEnded).toLocaleDateString()}`
                          : "March 15, 2025 - March 17, 2025"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {event?.dateStarted
                          ? `${new Date(event.dateStarted).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.dateEnded).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : "9:00 AM - 6:00 PM"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        {event?.location || "Convention Center, New York"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Organizer</p>
                      <p className="text-muted-foreground">Tech Events Inc.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">
                    About This Event
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event?.description ||
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
                  </p>
                </CardContent>
              </Card>

              {/* Ticket Types */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Ticket Options</h3>
                  <div className="space-y-3">
                    {event?.ticketTypes && event.ticketTypes.length > 0 ? (
                      event.ticketTypes.map((ticket, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {ticket.name.toLowerCase().includes("early")
                                ? "Limited time offer"
                                : ticket.name.toLowerCase().includes("vip")
                                  ? "Premium experience"
                                  : "Standard admission"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{ticket.price}</p>
                            <p className="text-xs text-muted-foreground">
                              {ticket.quantity} available
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Early Bird</p>
                            <p className="text-sm text-muted-foreground">
                              Limited time offer
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹99</p>
                            <p className="text-xs text-muted-foreground">
                              50 available
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Regular</p>
                            <p className="text-sm text-muted-foreground">
                              Standard admission
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹149</p>
                            <p className="text-xs text-muted-foreground">
                              200 available
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">VIP</p>
                            <p className="text-sm text-muted-foreground">
                              Premium experience
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹299</p>
                            <p className="text-xs text-muted-foreground">
                              25 available
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="pt-2">
                <Button
                  onClick={() => router.push(`/booking-page/${id}`)}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                >
                  <Tag className="mr-2 h-5 w-5" />
                  Book Now - Starting from ₹
                  {event?.ticketTypes && event.ticketTypes.length > 0
                    ? Math.min(...event.ticketTypes.map((t) => t.price))
                    : "99"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
