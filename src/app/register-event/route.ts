import dbConnect from "@/lib/dbConnect";
import EventModel from "@/model/Event.model";
import { createApiResponse } from "@/types/ApiResponse";
import { z } from "zod";
import { eventValidationSchema } from "@/schemas/eventValidationSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { organizer, ...eventData } = await request.json();

    const result = eventValidationSchema.safeParse({
      eventData,
    });

    if (!result.success) {
      return createApiResponse(false, "Invalid event format", 400);
    }

    const {
      name,
      description,
      category,
      location,
      imageUrl,
      dateCreated,
      dateStarted,
      dateEnded,
      ticketTypes,
    } = result.data;

    const existingEvent = await EventModel.findOne({ organizer, name });
    if (existingEvent) {
      return createApiResponse(false, "Event already exists", 400);
    }

    const newEvent = new EventModel ({
      organizer,
      name,
      description,
      category,
      location,
      imageUrl,
      dateCreated,
      dateStarted,
      dateEnded,
      status: "upcoming",
      ticketTypes,
    });
    await newEvent.save();

    return createApiResponse(true, "Event created successfully", 200);
  } catch (error) {
    return createApiResponse(false, error.message || "Failed to create event", 500);
  }
}
