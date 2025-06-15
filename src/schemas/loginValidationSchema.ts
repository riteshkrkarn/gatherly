import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username should atleast be 3 characters")
  .max(20, "Username can't be more than 20 characters long.")
  .regex(
    /^[a-zA-Z0-9_-]{3,20}$/,
    "Username must not contain any special character."
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must me atleast 6 characters" }),
});
