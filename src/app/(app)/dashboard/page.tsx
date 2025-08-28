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
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const data = await axios.get(
      `${baseUrl}/api/get-events?page=${page}&limit=12`
    );

    if (!data.status || data.status >= 400) {
      throw new Error(`Failed to fetch events: ${data.status}`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return empty data structure when API fails
    return {
      events: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalEvents: 0,
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
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-8xl mb-6">�</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                No Events Found
              </h2>
              <p className="text-gray-600 max-w-lg text-lg leading-relaxed mb-6">
                There are currently no events available in your area. New events
                are added regularly, so please check back soon!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                <span>💡 Try refreshing the page</span>
                <span>📅 Check back tomorrow</span>
                <span>🌟 Create your own event</span>
              </div>
            </div>
          )}

          {/* Server-Side Pagination - Only show if there are events */}
          {events.length > 0 && pagination.totalPages > 1 && (
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
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
