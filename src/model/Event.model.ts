import mongoose, { Schema, Document, Types } from "mongoose";
import { EVENT_STATUSES, type EventStatus } from "@/constants/eventConstants";

export interface Event extends Document {
  organizer: Types.ObjectId;
  name: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  image: string;
  dateCreated: Date;
  dateStarted: Date;
  dateEnded: Date;
  status: EventStatus;
  ticketTypes: { name: string; price: number; quantity: number }[];
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
    tagline: {
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
    image: {
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
    status: {
      type: String,
      enum: EVENT_STATUSES,
      default: "open",
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
