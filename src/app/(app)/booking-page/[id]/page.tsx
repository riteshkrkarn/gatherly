"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingSchema } from "@/schemas/bookingValdiationSchema";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import Footer from "@/components/ui/footer";
import { useParams } from "next/navigation";
import axios from "axios";

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

export default function BookingPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventId: eventId,
      ticketTypeName: "",
      quantityPurchased: 1,
    },
  });

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/events/${eventId}`);
        if (response.data.success) {
          setEventData(response.data.event);
          // Update form with correct eventId
          form.setValue("eventId", response.data.event._id);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId, form]);

  const selectedTicketType = eventData?.ticketTypes.find(
    (ticket) => ticket.name === form.watch("ticketTypeName")
  );

  const totalPrice = selectedTicketType
    ? selectedTicketType.price * form.watch("quantityPurchased")
    : 0;

  const gstAmount = totalPrice * 0.18; // 18% GST
  const finalTotal = totalPrice + gstAmount;

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    setIsSubmitting(true);

    try {
      // Create FormData to send to backend
      const formData = new FormData();
      formData.append("eventId", data.eventId);
      formData.append("ticketTypeName", data.ticketTypeName);
      formData.append("quantityPurchased", data.quantityPurchased.toString());

      const response = await axios.post(
        `/api/book-ticket/${eventId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Booking successful!");
        console.log("Booking data:", response.data);
      } else {
        alert(response.data.message || "Booking failed!");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while booking";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNavbar />
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
              Book Your Ticket
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Secure your spot at this amazing event
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-lg">Loading event details...</span>
            </div>
          ) : !eventData ? (
            <div className="text-center h-64 flex items-center justify-center">
              <p className="text-lg text-red-600">
                Failed to load event details. Please try again.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Event Details Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      {eventData.name}
                    </h3>
                    <p className="text-blue-100">Event Image Placeholder</p>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {eventData.name}
                  </h2>
                  <p className="text-gray-600 mb-6">{eventData.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                      <span>
                        {eventData.dateStarted
                          ? `${new Date(eventData.dateStarted).toLocaleDateString()} - ${new Date(eventData.dateEnded).toLocaleDateString()}`
                          : "Date TBA"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{eventData.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 mr-3 text-blue-600" />
                      <span>
                        {eventData.ticketTypes.length} ticket types available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Booking Details
                  </h2>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="ticketTypeName"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Ticket Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select ticket type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {eventData.ticketTypes.map((ticket) => (
                                  <SelectItem
                                    key={ticket.name}
                                    value={ticket.name}
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <span>{ticket.name}</span>
                                      <span className="ml-4 font-semibold">
                                        ₹{ticket.price}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantityPurchased"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const current = field.value;
                                    if (current > 1) {
                                      field.onChange(current - 1);
                                    }
                                  }}
                                  disabled={field.value <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>

                                <Input
                                  type="number"
                                  min="1"
                                  max={selectedTicketType?.quantity || 100}
                                  placeholder="Enter quantity"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className="h-12 w-20 text-center"
                                />

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const current = field.value;
                                    const maxQuantity =
                                      selectedTicketType?.quantity || 100;
                                    if (current < maxQuantity) {
                                      field.onChange(current + 1);
                                    }
                                  }}
                                  disabled={
                                    field.value >=
                                    (selectedTicketType?.quantity || 100)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            {selectedTicketType && (
                              <p className="text-sm text-gray-500">
                                Max available: {selectedTicketType.quantity}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Price Summary */}
                      {selectedTicketType && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <h3 className="font-semibold text-gray-900">
                            Price Summary
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>
                                {selectedTicketType.name} x{" "}
                                {form.watch("quantityPurchased")}
                              </span>
                              <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>GST (18%)</span>
                              <span>₹{gstAmount.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Amount</span>
                            <span className="text-lg text-blue-600">
                              ₹{finalTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !selectedTicketType}
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing Booking...
                            </>
                          ) : (
                            <>
                              Book Tickets - ₹{finalTotal.toFixed(2)}
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
