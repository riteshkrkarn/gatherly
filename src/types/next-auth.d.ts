import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isOrganizer?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isOrganizer?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}
