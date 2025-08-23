"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { NextResponse } from "next/server";
import { eventValidationSchema } from "@/schemas/eventValidationSchema";
import FileUploader from "@/components/file-uploader";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import Footer from "@/components/ui/footer";

const categories = [
  "Technology",
  "Business",
  "Arts & Culture",
  "Sports",
  "Music",
  "Education",
  "Health & Wellness",
  "Food & Drink",
  "Travel",
  "Other",
];

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSameDayEvent, setIsSameDayEvent] = useState(false);

  const form = useForm<z.infer<typeof eventValidationSchema>>({
    resolver: zodResolver(eventValidationSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      category: "",
      location: "",
      image: undefined,
      dateStarted: new Date(),
      dateEnded: new Date(),
      ticketTypes: [{ name: "", price: 0, quantity: 1 }],
    },
  });

  const onSubmit = async (data: z.infer<typeof eventValidationSchema>) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("tagline", data.tagline);
      formData.append("description", data.description);
      formData.append("cateogry", data.category);
      formData.append("location", data.location);
      formData.append("dateStarted", data.dateStarted.toISOString());
      formData.append("dateEnded", data.dateEnded.toISOString());
      formData.append("ticketTypes", JSON.stringify(data.ticketTypes));

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post("/api/create-event", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSubmitting(false);
      return NextResponse.json(response.data);
    } catch (error) {
      console.log(error);

      const axiosError = error as AxiosError<{ message: string }>;
      setIsSubmitting(false);
      return NextResponse.json(
        {
          success: false,
          message: axiosError.response?.data?.message ?? "Error creating event",
        },
        { status: 400 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNavbar />
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
              Ready to Host?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create an amazing event that brings people together
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-8 lg:p-12"
              >
                {/* Basic Information Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                      Event Information
                    </h2>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter event name"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Catchy event tagline"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 space-y-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe your event"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="image"
                    render={() => (
                      <FormItem className="space-y-1">
                        <FormLabel>Event Image</FormLabel>
                        <FormControl>
                          <FileUploader />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date and Duration Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Date & Duration
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Event Duration
                      </label>
                      <Select
                        value={isSameDayEvent ? "same-day" : "multi-day"}
                        onValueChange={(value) => {
                          const isSameDay = value === "same-day";
                          setIsSameDayEvent(isSameDay);
                          if (isSameDay) {
                            const startDate = form.getValues("dateStarted");
                            form.setValue("dateEnded", startDate);
                          }
                        }}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select event duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same-day">
                            Same Day Event
                          </SelectItem>
                          <SelectItem value="multi-day">
                            Multi-Day Event
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <FormField
                      control={form.control}
                      name="dateStarted"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-1">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`h-12 w-full pl-3 text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  if (isSameDayEvent && date) {
                                    form.setValue("dateEnded", date);
                                  }
                                }}
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!isSameDayEvent && (
                      <FormField
                        control={form.control}
                        name="dateEnded"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`h-12 w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    const startDate =
                                      form.getValues("dateStarted");
                                    return date < startDate;
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Ticket Types Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Ticket Information
                  </h2>

                  <div className="space-y-6">
                    {form.watch("ticketTypes").map((_, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-900">
                            Ticket Type {index + 1}
                          </h4>
                          {form.watch("ticketTypes").length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentTickets =
                                  form.getValues("ticketTypes");
                                const updatedTickets = currentTickets.filter(
                                  (_, i) => i !== index
                                );
                                form.setValue("ticketTypes", updatedTickets);
                              }}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`ticketTypes.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Ticket Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Early Bird"
                                    {...field}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`ticketTypes.${index}.price`}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Price (₹)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter price (e.g., 999)"
                                    {...field}
                                    value={field.value === 0 ? "" : field.value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value === "" ? 0 : Number(value)
                                      );
                                    }}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`ticketTypes.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter quantity (e.g., 100)"
                                    {...field}
                                    value={field.value === 1 ? "" : field.value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value === "" ? 1 : Number(value)
                                      );
                                    }}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-col items-center space-y-2">
                      {form.watch("ticketTypes").length < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full max-w-sm h-12 border-dashed border-2 hover:bg-gray-50"
                          onClick={() => {
                            const currentTickets =
                              form.getValues("ticketTypes");
                            form.setValue("ticketTypes", [
                              ...currentTickets,
                              { name: "", price: 0, quantity: 1 },
                            ]);
                          }}
                        >
                          + Add Ticket Type
                        </Button>
                      )}

                      {form.watch("ticketTypes").length === 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          Maximum of 3 ticket types allowed
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Event...
                        </>
                      ) : (
                        <>
                          Create Event
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
