import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);

        await dbConnect();
        const userDoc = await UserModel.findOne({
          $or: [
            { email: credentials!.identifier },
            { username: credentials!.identifier },
          ],
        });
        const user = userDoc ? userDoc.toObject() : null;
        console.log("User found:", user);

        if (!user) {
          console.log("No user found for email:", credentials!.identifier);
          return null;
        }

        // Check if user is verified (if required)
        if (!user.isVerified) {
          console.log("User not verified:", user.email);
          return null;
        }

        // Check password
        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        console.log("Password valid:", isValid);

        if (!isValid) {
          console.log("Invalid password for user:", user.email);
          return null;
        }

        // If all checks pass, return user object
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isOrganizer = token.isOrganizer;
        session.user.username = token.username;
        session.user.avatar = token.avatar;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isOrganizer = user.isOrganizer;
        token.username = user.username;
        token.avatar = user.avatar;
      }

      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
