import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound, Settings, BookCheck, TicketPlus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const user: User = session?.user;

  if(status == "loading") {
    return <div>Loading...</div>
  }

  if(!session) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user?.avatar || ""} alt="Profile image" />
            <AvatarFallback>PP</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user?.name || "Name"}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user?.username || "username"}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRound className="size-4 opacity-60" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <BookCheck className="size-4 opacity-60" />
            <span>My Bookings</span>
          </DropdownMenuItem>

          {user?.isOrganizer ? (
            <DropdownMenuItem>
              <TicketPlus className="size-4 opacity-60" />
              <span>Organize Event</span>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem>
            <Settings className="size-4 opacity-60" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
