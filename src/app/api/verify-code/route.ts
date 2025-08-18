import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/loginValidationSchema";
import { createApiResponse } from "@/types/ApiResponse";

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
      return createApiResponse(
        false,
        "Invalid username or verification code format",
        400
      );
    }

    const decodedUsername = decodeURIComponent(result.data.username);

    const user = await UserModel.findOne({ decodedUsername });
    if (!user) {
      return createApiResponse(false, "User not found", 404);
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired || isCodeValid) {
      user.isVerified = true;
      user.save();
      return createApiResponse(true, "Verification successful", 200);
    } else if (!isCodeNotExpired) {
      return createApiResponse(false, "Verification code has expired", 400);
    } else {
      return createApiResponse(false, "Invalid verification code", 400);
    }
  } catch (error) {
    console.log("Error verifying otp");
    return Response.json(
      { success: false, message: error || "Error verifying otp" },
      {
        status: 500,
      }
    );
  }
}
