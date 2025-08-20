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

interface PageProps {
  searchParams: { page?: string };
}

interface Event {
  _id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
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
    const data = await fetch(`/api/get-events?page=${page}&limit=12`, {
      cache: "no-store",
    });

    if (!data.ok) {
      throw new Error(`Failed to fetch events: ${data.status}`);
    }

    return data.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return empty data as fallback
    return {
      events: [],
      pagination: {
        currentPage: 1,
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
                  description={event.description}
                  location={event.location}
                  imageUrl={event.imageUrl}
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
