import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User.model";
import { upload } from "@/lib/upload";
import { createApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    console.log("FormData received:", Array.from(formData.entries()));

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const isOrganizer = formData.get("isOrganizer") === "true";
    const password = formData.get("password") as string;
    const avatar = formData.get("avatar") as File | null;

    console.log(
      "Avatar file:",
      avatar
        ? { name: avatar.name, size: avatar.size, type: avatar.type }
        : "No file"
    );

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return createApiResponse(false, "Username is already taken", 400);
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    let avatarUrl = "";
    if (avatar && avatar.size > 0) {
      console.log("Starting avatar upload...");
      try {
        avatarUrl = await upload(avatar);
        console.log("Avatar uploaded successfully:", avatarUrl);
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
        return createApiResponse(false, "Error uploading avatar", 500);
      }
    } else {
      console.log("No avatar to upload");
    }

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return createApiResponse(false, "User already verified", 400);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();

        if (avatarUrl) {
          console.log("Updating existing user avatar:", avatarUrl);
          existingUserByEmail.avatar = avatarUrl;
          await existingUserByEmail.save();
        }
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        name,
        email,
        username,
        isOrganizer,
        avatar: avatarUrl,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });

      console.log("Creating new user with avatar:", avatarUrl || "no avatar");
      await newUser.save();
    }

    //Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return createApiResponse(false, "Error sending verification email", 500);
    }

    return createApiResponse(true, "User registered successfully", 200);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error registering user.";
    throw new Error(errorMessage);
  }
}
