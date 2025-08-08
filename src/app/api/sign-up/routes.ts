import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
// import { success } from "zod/v4";
import UserModel from "@/model/User.model";
// import { TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST } from "next/dist/shared/lib/constants";

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

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: true,
            message: "User is already registered with this email.",
          },
          { status: 401 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        name,
        email,
        userName,
        isOrganizer,
        avatar: "",
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });

      await newUser.save();
    }

    //Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User regiestered. Please verify your email.",
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error registering user.";
    throw new Error(errorMessage);
  }
}
