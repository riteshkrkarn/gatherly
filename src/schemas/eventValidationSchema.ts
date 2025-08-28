import { z } from "zod";

export const ticketTypeValidationSchema = z.object({
  name: z.string().min(3, "Ticket name must be at least 3 characters long."),
  price: z.number().nonnegative("Price cannot be a negative number."),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .positive("You must provide at least 1 ticket."),
});

export const eventValidationSchema = z
  .object({
    name: z.string().min(2, "The event name must be atleast 2 characters."),
    tagline: z
      .string()
      .min(2, "The event tagline must be atleast 2 characters."),
    description: z.string(),
    category: z.string(),
    location: z.string().min(3, "Location Should atleast be 3 character long"),
    image: z.instanceof(File).optional(),
    dateStarted: z.date(),
    dateEnded: z.date(),
    ticketTypes: z
      .array(ticketTypeValidationSchema)
      .min(1, "There must be a single type ticket.")
      .max(3, "There can only be max 3 types of tickets."),
  })
  .refine((data) => data.dateStarted < data.dateEnded, {
    message: "Start date must be before end date.",
    path: ["dateEnded"],
  });
