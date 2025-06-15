import {z} from "zod";

export const bookingSchema = z.object({
    eventId: z.string(),
    ticketTypeName: z.string(),
    quantityPurchased: z.number().min(1, "Quantitiy purchased must be greater than 0")
})