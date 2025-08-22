import EventCard from "@/components/ui/event-card";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import Footer from "@/components/ui/footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";

interface PageProps {
  searchParams: { page?: string };
}

interface Event {
  _id: string;
  name: string;
  tagline: string;
  location: string;
  image: string;
  date?: string;
}

interface ApiResponse {
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

async function getEvents(page: number = 1): Promise<ApiResponse> {
  try {
    const data = await axios.get(`/api/get-events?page=${page}&limit=12`);

    if (!data.status || data.status >= 400) {
      throw new Error(`Failed to fetch events: ${data.status}`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return sample data as fallback for testing
    return {
      events: [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Tech Conference 2025",
          tagline: "The future of technology starts here",
          location: "Convention Center, San Francisco",
          image: "/images/hero.jpg",
          date: "March 15, 2025",
        },
        {
          _id: "507f1f77bcf86cd799439012",
          name: "Web Dev Summit",
          tagline: "Learn the latest in web development",
          location: "Tech Hub, Austin",
          image: "/images/hero.jpg",
          date: "April 20, 2025",
        },
        {
          _id: "507f1f77bcf86cd799439013",
          name: "AI Innovation Workshop",
          tagline: "Hands-on AI and machine learning",
          location: "Innovation Center, Seattle",
          image: "/images/hero.jpg",
          date: "May 10, 2025",
        },
        {
          _id: "507f1f77bcf86cd799439014",
          name: "Startup Pitch Night",
          tagline: "Connect with investors and entrepreneurs",
          location: "Business District, New York",
          image: "/images/hero.jpg",
          date: "June 5, 2025",
        },
        {
          _id: "507f1f77bcf86cd799439015",
          name: "Digital Marketing Masterclass",
          tagline: "Master the art of digital marketing",
          location: "Marketing Hub, Los Angeles",
          image: "/images/hero.jpg",
          date: "July 12, 2025",
        },
        {
          _id: "507f1f77bcf86cd799439016",
          name: "Blockchain Symposium",
          tagline: "Exploring the future of blockchain",
          location: "Finance Center, Chicago",
          image: "/images/hero.jpg",
          date: "August 18, 2025",
        },
      ],
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalEvents: 6,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export default async function Dashboard({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const { events, pagination } = await getEvents(currentPage);

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />
      <main className="flex-1">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-8">Discover Events</h1>

          {/* Events Grid */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  name={event.name}
                  tagline={event.tagline}
                  location={event.location}
                  image={event.image}
                  date={event.date}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">🎪</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No Events Nearby
              </h2>
              <p className="text-gray-500 max-w-md">
                There are no events available in your area at the moment. Check
                back later or explore events in other locations.
              </p>
            </div>
          )}

          {/* Server-Side Pagination */}
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                {pagination.hasPrevPage && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/dashboard?page=${currentPage - 1}`}
                    />
                  </PaginationItem>
                )}

                {/* Generate page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - currentPage) <= 2
                  )
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/dashboard?page=${page}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {pagination.totalPages > 5 &&
                  currentPage < pagination.totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                {pagination.hasNextPage && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/dashboard?page=${currentPage + 1}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
