import dbConnect from "@/lib/dbConnect";
import EventModel from "@/model/Event.model";
import { upload } from "@/lib/upload";
import { NextResponse } from "next/server";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user: User = session.user;

    const formData = await request.formData();

    const name = formData.get("name") as string;
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
      } catch (parseError) {
        return NextResponse.json(
          { success: false, message: "Invalid ticket types format" },
          { status: 400 }
        );
      }
    }

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

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await upload(imageFile);
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { success: false, message: "Image upload failed" },
          { status: 500 }
        );
      }
    } else {
      console.log("No image to upload");
    }

    // Check event status based on current date
    const currentDate = new Date();
    let eventStatus = "open";

    if (dateEnded < currentDate) {
      eventStatus = "completed";
    }

    const newEvent = new EventModel({
      organizer: user._id,
      name,
      description,
      category,
      location,
      dateStarted,
      dateEnded,
      imageUrl: imageUrl,
      status: eventStatus,
      ticketTypes: ticketTypes,
      dateCreated: new Date(),
    });

    await newEvent.save();

    return NextResponse.json(
      { success: true, event: newEvent },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error registering user.";
    throw new Error(errorMessage);
  }
}
