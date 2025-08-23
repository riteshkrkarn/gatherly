import dbConnect from "@/lib/dbConnect";
import BookingModel from "@/model/Booking.model";
import EventModel from "@/model/Event.model";
import { NextResponse } from "next/server";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
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

    const formData = await req.formData();

    const eventId = formData.get("eventId") as string;
    const ticketTypeName = formData.get("ticketTypeName") as string;
    const quantity = Number(formData.get("quantityPurchased"));

    const event = await EventModel.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const ticketTypeIndex = event.ticketTypes.findIndex(
      (ticket) => ticket.name === ticketTypeName
    );

    if (ticketTypeIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Ticket type not found" },
        { status: 400 }
      );
    }

    const ticketType = event.ticketTypes[ticketTypeIndex];

    if (ticketType.quantity < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${ticketType.quantity} tickets available for ${ticketTypeName}`,
        },
        { status: 400 }
      );
    }

    const existingBooking = await BookingModel.findOne({
      user: user.id,
      event: eventId,
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already made a booking for this event",
        },
        { status: 400 }
      );
    }

    const newBooking = new BookingModel({
      user: user.id,
      event: eventId,
      ticketType: ticketTypeName,
      quantityPurchased: quantity,
    });

    event.ticketTypes[ticketTypeIndex].quantity -= quantity;

    await Promise.all([newBooking.save(), event.save()]);

    return NextResponse.json({
      success: true,
      message: "Booking successful",
      remainingTickets: event.ticketTypes[ticketTypeIndex].quantity,
    });
  } catch (error) {
    console.error("Error booking ticket:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
