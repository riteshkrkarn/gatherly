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
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("tagline", data.tagline);
      formData.append("description", data.description);
      formData.append("cateogry", data.category);
      formData.append("location", data.location);
      formData.append("dateStarted", data.dateStarted.toISOString());
      formData.append("dateEnded", data.dateEnded.toISOString());
      formData.append("ticketTypes", JSON.stringify(data.ticketTypes));

      // Append image file if present
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-4">
        <div className="text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            {" "}
            Ready to Host?
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="Tagline" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file || undefined);
                      }}
                      {...field}
                      value=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium">Event Duration</label>
              <Select
                value={isSameDayEvent ? "same-day" : "multi-day"}
                onValueChange={(value) => {
                  const isSameDay = value === "same-day";
                  setIsSameDayEvent(isSameDay);
                  if (isSameDay) {
                    // Set end date same as start date
                    const startDate = form.getValues("dateStarted");
                    form.setValue("dateEnded", startDate);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same-day">Same Day Event</SelectItem>
                  <SelectItem value="multi-day">Multi-Day Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="dateStarted"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
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
                    <PopoverContent className="w-auto p-0" align="start">
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
                          date < new Date(new Date().setHours(0, 0, 0, 0))
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
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("dateStarted");
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

            <div>
              <FormLabel>Ticket Types</FormLabel>
              {form.watch("ticketTypes").map((_, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg space-y-4 mt-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Ticket Type</h4>
                    {form.watch("ticketTypes").length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentTickets = form.getValues("ticketTypes");
                          const updatedTickets = currentTickets.filter(
                            (_, i) => i !== index
                          );
                          form.setValue("ticketTypes", updatedTickets);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`ticketTypes.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Early Bird" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`ticketTypes.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price (e.g., 99)"
                            {...field}
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : Number(value));
                            }}
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
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter quantity (e.g., 100)"
                            {...field}
                            value={field.value === 1 ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 1 : Number(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {form.watch("ticketTypes").length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    const currentTickets = form.getValues("ticketTypes");
                    form.setValue("ticketTypes", [
                      ...currentTickets,
                      { name: "", price: 0, quantity: 1 },
                    ]);
                  }}
                >
                  Add Ticket Type
                </Button>
              )}

              {form.watch("ticketTypes").length === 3 && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Maximum of 3 ticket types allowed
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Create Event"
                )}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
