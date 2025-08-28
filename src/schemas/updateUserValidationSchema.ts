import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export default updateUserSchema;
