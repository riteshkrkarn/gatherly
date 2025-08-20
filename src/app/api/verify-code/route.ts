import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupValidationSchema";
import { NextResponse } from "next/server";

const verifyCodeSchema = z.object({
  username: usernameValidation,
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const result = verifyCodeSchema.safeParse({ username, code });
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.message },
        { status: 400 }
      )
    }

    const decodedUsername = decodeURIComponent(result.data.username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json({ success: true, message: "User verified" }, {status: 200});
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying otp");
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    )
  }
}
