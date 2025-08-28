import mongoose, { Schema, Document, Types } from "mongoose";

export interface Booking extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  ticketType: string;
  quantityPurchased: number;
  totalCost: number;
  datePurchased: Date;
}

const BookingSchema: Schema<Booking> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType: {
      type: String,
      required: true,
    },
    quantityPurchased: {
      type: Number,
      required: true,
    },
    datePurchased: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel =
  (mongoose.models.Booking as mongoose.Model<Booking>) ||
  mongoose.model<Booking>("Booking", BookingSchema);

export default BookingModel;
