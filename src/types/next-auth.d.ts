import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isOrganizer?: boolean;
    userName?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isOrganizer?: boolean;
      userName?: string;
    } & DefaultSession["user"];
  }
}
