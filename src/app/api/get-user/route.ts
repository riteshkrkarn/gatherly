import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userDetails = await UserModel.findOne({
      username: request.nextUrl.searchParams.get("username"),
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        username: userDetails.username,
        name: userDetails.name,
        email: userDetails.email,
        isOrganizer: userDetails.isOrganizer,
        avatarURL: userDetails.avatar,
        isVerified: userDetails.isVerified,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
