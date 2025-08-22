"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "@/components/ui/footer";

type UserProfile = {
  name: string;
  email: string;
  username: string;
  isOrganizer: string;
  avatar: string;
  isVerified: boolean;
};

export default function Page() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/get-user")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 401
        ) {
          router.replace("/sign-in");
        } else {
          console.error(err);
        }
      });
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />
      <main className="flex-1">
        <div className="container mx-auto p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            <Button
              variant="outline"
              onClick={() => router.push("/update-user")}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar and name on the left for lg screens */}
            <div className="flex flex-col items-center justify-center w-full lg:w-1/4 mb-8 lg:mb-0">
              <div className="flex flex-col items-center w-full">
                <Avatar className="w-40 h-40 lg:w-60 lg:h-60">
                  <AvatarImage src={user?.avatar || ""} alt="Profile image" />
                  <AvatarFallback className="text-6xl lg:text-8xl">
                    PP
                  </AvatarFallback>
                </Avatar>
                {user?.name && (
                  <div className="mt-4 text-xl font-semibold text-center w-full">
                    {user.name}
                  </div>
                )}
              </div>
            </div>
            {/* Profile card with user details on the right */}
            <div className="flex-1 w-full flex flex-col">
              {/* User Details Title */}
              <div className="mb-2 text-lg font-semibold text-muted-foreground">
                User Details
              </div>
              <Card className="w-full">
                <CardContent className="flex flex-col items-start gap-4 py-8">
                  {user?.username && (
                    <div className="text-base">
                      <span className="font-medium">Username:</span>{" "}
                      {user.username}
                    </div>
                  )}
                  {user?.email && (
                    <div className="text-base">
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Your Reviews Title */}
              <div className="mb-2 mt-8 text-lg font-semibold text-muted-foreground">
                Your Reviews
              </div>
              <Card className="w-full">
                <CardContent className="flex flex-col items-start gap-4 py-8">
                  <div className="text-base text-muted-foreground">
                    You haven&apos;t reviewed any event yet
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
