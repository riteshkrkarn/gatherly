import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name should be atleast 3 characters"),

  username: z
    .string()
    .min(3, "Username should atleast be 3 characters")
    .max(20, "Username can't be more than 20 characters long.")
    .regex(
      /^[a-zA-Z0-9_-]{3,20}$/,
      "Username must not contain any special character."
    ),

  avatar: z.instanceof(File).optional(),
});
