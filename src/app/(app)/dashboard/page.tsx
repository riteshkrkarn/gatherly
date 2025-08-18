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
    const res = await fetch(`/api/get-events?page=${page}&limit=12`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return mock data as fallback
    return {
      events: [
        {
          _id: "1",
          name: "Tech Conference 2024",
          description:
            "Join industry leaders for cutting-edge tech insights and networking opportunities.",
          location: "San Francisco Convention Center",
          imageUrl: "/images/hero.jpg",
          date: "Dec 15, 2024",
        },
        {
          _id: "2",
          name: "Music Festival Downtown",
          description:
            "Experience live performances from top artists across multiple genres.",
          location: "Central Park Amphitheater",
          imageUrl: "/images/hero.jpg",
          date: "Dec 20, 2024",
        },
        {
          _id: "3",
          name: "Food & Wine Expo",
          description:
            "Taste exceptional cuisine and discover new wines from local chefs.",
          location: "Metropolitan Exhibition Hall",
          imageUrl: "/images/hero.jpg",
          date: "Dec 18, 2024",
        },
        {
          _id: "4",
          name: "Digital Marketing Summit",
          description:
            "Learn the latest digital marketing strategies from industry experts.",
          location: "Business Innovation Center",
          imageUrl: "/images/hero.jpg",
          date: "Dec 22, 2024",
        },
        {
          _id: "5",
          name: "Photography Workshop",
          description:
            "Master the art of photography with hands-on sessions and expert guidance.",
          location: "Creative Arts Studio",
          imageUrl: "/images/hero.jpg",
          date: "Dec 25, 2024",
        },
        {
          _id: "6",
          name: "Blockchain & Web3 Meetup",
          description:
            "Explore the future of decentralized technologies and network with blockchain enthusiasts.",
          location: "Tech Hub Downtown",
          imageUrl: "/images/hero.jpg",
          date: "Dec 28, 2024",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalEvents: 45,
        hasNextPage: true,
        hasPrevPage: false,
      },
    };
  }
}

export default async function Dashboard({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || "1");
  const { events, pagination } = await getEvents(currentPage);

  return (
    <div>
      <DashboardNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Discover Events</h1>

        {/* Events Grid */}
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
                  <PaginationNext href={`/dashboard?page=${currentPage + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <Footer />
    </div>
  );
}
