import dbConnect from "@/lib/dbConnect";
import EventModel from "@/model/Event.model";
import { upload } from "@/lib/upload";
import { NextResponse } from "next/server";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request) {
  console.log("[API] /api/create-event POST called");
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    console.log("[API] session:", session);

    if (!session || !session.user) {
      console.log("[API] Unauthorized request - no session");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user: User = session.user;
    console.log("[API] authenticated user:", user);

    const formData = await request.formData();
    console.log("[API] Received formData:");
    for (const pair of formData.entries()) {
      console.log("[API] FormData entry:", pair[0], pair[1]);
    }

    const name = formData.get("name") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const dateStarted = new Date(formData.get("dateStarted") as string);
    const dateEnded = new Date(formData.get("dateEnded") as string);
    const imageFile = formData.get("image") as File | null;

    // Parse ticket types from FormData
    const ticketTypesData = formData.get("ticketTypes") as string;
    let ticketTypes = [];

    if (ticketTypesData) {
      try {
        ticketTypes = JSON.parse(ticketTypesData);
        console.log("[API] Parsed ticketTypes:", ticketTypes);
      } catch (parseError) {
        console.log("[API] Error parsing ticketTypes:", parseError);
        return NextResponse.json(
          { success: false, message: "Invalid ticket types format" },
          { status: 400 }
        );
      }
    }

    // Only multi-day events are allowed; no single-day logic
    const existingEvent = await EventModel.findOne({
      name,
      dateStarted,
      dateEnded,
    });

    if (existingEvent) {
      return NextResponse.json(
        { success: false, message: "Event already exists" },
        { status: 400 }
      );
    }

    let imageURL = "";
    if (imageFile && imageFile.size > 0) {
      try {
        console.log("[API] Uploading image file:", imageFile);
        imageURL = await upload(imageFile);
        console.log("[API] Image uploaded, URL:", imageURL);
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { success: false, message: "Image upload failed" },
          { status: 500 }
        );
      }
    } else {
      console.log("[API] No image to upload");
    }

    // Check event status based on current date
    const currentDate = new Date();
    let eventStatus = "open";
    if (dateEnded < currentDate) {
      eventStatus = "completed";
    }
    // No single-day event logic; always expect multi-day

    const newEvent = new EventModel({
      organizer: user._id,
      name,
      tagline,
      description,
      category,
      location,
      dateStarted,
      dateEnded,
      image: imageURL,
      status: eventStatus,
      ticketTypes: ticketTypes,
      dateCreated: new Date(),
    });

    console.log("[API] Saving new event:", newEvent);
    await newEvent.save();

    console.log("[API] Event created successfully");
    return NextResponse.json(
      { success: true, event: newEvent },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[API] Error in create-event route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error registering user.";
    throw new Error(errorMessage);
  }
}
