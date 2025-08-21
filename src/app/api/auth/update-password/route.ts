import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { oldPassword, newPassword, confirmPassword } = body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Old password, new password, and confirm password are required",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password and confirm password do not match",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    const token = await getToken({ req: request as NextRequest });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token._id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.password
    );

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different from current password",
        },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating password" },
      { status: 500 }
    );
  }
}
