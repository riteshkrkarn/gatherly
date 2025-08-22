"use client";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      {session ? <DashboardNavbar /> : <Navbar />}
      <main className="flex-1">
        <div className="container mx-auto p-4 flex flex-col">
          {/* About heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-4">
              About Gatherly
            </h1>
            <p className="text-xl text-muted-foreground text-center">
              Your go-to platform for event management and discovery
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {/* What it does */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">What is Gatherly?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Gatherly is an event management platform that connects event
                organizers with attendees. It provides a seamless experience for
                creating, managing, and attending events of all types.
              </p>
            </div>

            {/* Features */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Event Creation</h3>
                  <p className="text-muted-foreground">
                    Create and manage events with ease
                  </p>
                </div>
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    User Authentication
                  </h3>
                  <p className="text-muted-foreground">
                    Secure user authentication and profile management
                  </p>
                </div>
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Event Booking</h3>
                  <p className="text-muted-foreground">
                    Easy event booking and registration system
                  </p>
                </div>
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    Organizer Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Comprehensive dashboard for event management
                  </p>
                </div>
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">User Reviews</h3>
                  <p className="text-muted-foreground">
                    Review and feedback system for events
                  </p>
                </div>
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    Responsive Design
                  </h3>
                  <p className="text-muted-foreground">
                    Works seamlessly on all devices
                  </p>
                </div>
              </div>
            </div>

            {/* Developer */}
            <div className="text-center bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Developer</h2>
              <p className="text-lg text-muted-foreground mb-4">
                This project was made by{" "}
                <span className="font-medium text-foreground">
                  Ritesh Kumar Karn
                </span>{" "}
                as a personal project.
              </p>
              <div className="text-base text-muted-foreground">
                <p className="mb-4">Connect with me:</p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="https://x.com/riteshkrkarn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://github.com/riteshkrkarn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href="mailto:riteshkumarkarn414@gmail.com"
                    className="p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
