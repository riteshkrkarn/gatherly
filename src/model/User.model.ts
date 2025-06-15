import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  username: string;
  role: "attendee" | "organizer";
  avatar: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  createdAt?: Date;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Attendee", "Organizer"],
      default: "attendee",
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    verifyCode: {
      types: String,
      required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      requited: [true, "Verify code expiry is required"]
    },
    createdAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
