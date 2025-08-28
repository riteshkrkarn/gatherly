import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = await getToken({ req: request as NextRequest });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userDetails = await UserModel.findOne({
      _id: token._id,
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
        avatar: userDetails.avatar,
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
