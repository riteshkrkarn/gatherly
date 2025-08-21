import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { upload } from "@/lib/upload";

interface UpdateUserData {
  name?: string;
  username?: string;
  avatar?: string;
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const avatar = formData.get("avatar") as File | null;

    if (!name && !username && (!avatar || avatar.size === 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Atleast one field is required",
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

    const userId = await token._id;
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

    if (username && username !== existingUser.username) {
      const existingUserWithUsername = await UserModel.findOne({
        username,
        isVerified: true,
        _id: { $ne: userId },
      });

      if (existingUserWithUsername) {
        return NextResponse.json(
          { success: false, message: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    const updateData: UpdateUserData = {};

    if (name && name.trim() !== "") {
      updateData.name = name.trim();
    }

    if (username && username.trim() !== "") {
      updateData.username = username.trim();
    }

    if (avatar && avatar.size > 0) {
      console.log("Starting avatar upload...");
      try {
        const updatedAvatarUrl = await upload(avatar);
        console.log("Avatar uploaded successfully:", updatedAvatarUrl);
        updateData.avatar = updatedAvatarUrl;
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
        return NextResponse.json(
          { success: false, message: "Avatar upload failed" },
          { status: 500 }
        );
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.log("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
