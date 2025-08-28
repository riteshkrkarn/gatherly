import dbConnect from "@/lib/dbConnect";
import BookingModel from "@/model/Booking.model";
import EventModel from "@/model/Event.model";
import { NextResponse } from "next/server";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
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
    const userId = user._id;
    const isOrganizer = user.isOrganizer || false;

    const attendedBookings = await BookingModel.find({ user: userId })
      .populate("event")
      .sort({ datePurchased: -1 });

    const attendedEvents = attendedBookings.map((booking) => ({
      event: booking.event,
      ticketType: booking.ticketType,
      quantityPurchased: booking.quantityPurchased,
      datePurchased: booking.datePurchased,
    }));

    let organizedEvents: Array<{
      totalBookings: number;
      revenue: number;
      [key: string]: unknown;
    }> = [];

    if (isOrganizer) {
      const events = await EventModel.find({ organizer: userId }).sort({
        dateCreated: -1,
      });

      organizedEvents = await Promise.all(
        events.map(async (event) => {
          const bookings = await BookingModel.find({ event: event._id });
          const actualRevenue = bookings.reduce((total, booking) => {
            const ticketType = event.ticketTypes.find(
              (t) => t.name === booking.ticketType
            );

            const ticketPrice = ticketType ? ticketType.price : 0;

            const subtotal = ticketPrice * booking.quantityPurchased;

            const gstAmount = subtotal * 0.18;

            return total + subtotal + gstAmount;
          }, 0);

          const totalTicketsSold = bookings.reduce(
            (sum, booking) => sum + booking.quantityPurchased,
            0
          );

          return {
            ...event.toObject(),
            totalBookings: totalTicketsSold,
            revenue: actualRevenue,
          };
        })
      );
    }

    const stats = {
      totalAttended: attendedEvents.length,
      totalOrganized: organizedEvents.length,
      totalRevenue: organizedEvents.reduce(
        (sum, event) => sum + event.revenue,
        0
      ),
    };

    return NextResponse.json({
      success: true,
      data: {
        attendedEvents,
        organizedEvents,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching my events:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
