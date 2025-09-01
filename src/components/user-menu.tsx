import { LogOutIcon } from "lucide-react";
import Link from "next/link";

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
import { UserRound, Settings, TicketPlus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const user: User = session?.user;

  if (status == "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
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
          <DropdownMenuItem className="hover: cursor-pointer">
            <Link href="/profile-page" className="flex gap-2">
              <UserRound className="size-4 opacity-60" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          {user?.isOrganizer ? (
            <DropdownMenuItem className="hover: cursor-pointer">
              <Link href="/create-event" className="flex gap-2">
                <TicketPlus className="size-4 opacity-60" />
                <span>Organize Event</span>
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem className="hover: cursor-pointer">
            <Settings className="size-4 opacity-60" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="hover: cursor-pointer"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
