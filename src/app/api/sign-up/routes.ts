import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod/v4";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, userName, isOrganizer, password } =
      await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      userName,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      true;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      new UserModel({
        name,
        email,
        userName,
        isOrganizer,
        avatar: "",
        password: hashedPassword,
        verifyCodeExpiry: Date,
      });
    }
  } catch (error) {
    console.log("Error registering user.");
    return Response.json(
      {
        success: false,
        message: "Error registering user.",
      },
      {
        status: 500,
      }
    );
  }
}
