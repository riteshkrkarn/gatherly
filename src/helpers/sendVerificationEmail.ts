import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmailTemp";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components";
import React from "react";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const html = await render(
      React.createElement(VerificationEmail, { username, otp: verifyCode })
    );

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Gatherly verification email",
      html: html,
    });

    return { success: true, message: "Verification email send successfully." };
  } catch (emailError) {
    console.log("Error sending verification email.", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
