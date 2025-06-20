import mongoose, { Schema, Document, Types } from "mongoose";

export interface Event extends Document {
  organizer: Types.ObjectId;
  name: string;
  description: string;
  category: string;
  location: string;
  imageUrl: string;
  dateCreated: Date;
  dateStarted: Date;
  dateEnded: Date;
  ticketTypes: [{ name: string; price: number; quantity: number }];
}

const EventSchema: Schema<Event> = new Schema(
  {
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      required: true,
    },
    dateStarted: {
      type: Date,
      required: true,
    },
    dateEnded: {
      type: Date,
      required: true,
    },
    ticketTypes: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const EventModel = mongoose.model<Event>("Event", EventSchema);

export default EventModel;
