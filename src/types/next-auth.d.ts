import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    avatar?: string;
    username?: string;
    isOrganizer?: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      avatar?: string;
      username?: string;
      isOrganizer?: boolean;
    } & DefaultSession["user"];
  }
}
