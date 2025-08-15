import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/loginValidationSchema";
import { createApiResponse } from "@/types/ApiResponse";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //Validate with zod schema
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); //TODO
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return createApiResponse(false, "" + usernameErrors.join(", "), 400);
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return createApiResponse(false, "Username is already taken", 400);
    }

    return createApiResponse(true, "Username is available", 200);
  } catch (error) {
    console.log("Error checking username uniqueness.");
    return Response.json(
      { success: false, message: "Error checking username uniqueness." },
      {
        status: 500,
      }
    );
  }
}
