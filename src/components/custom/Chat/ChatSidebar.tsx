"use client";
import { Menu, MessageCircle, PlusCircle } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../../ui/sheet";
import { type DrizzleChat } from "~/server/db/schema";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: string;
};

const ChatSidebar = ({ chats, chatId }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="absolute left-4 top-2 z-50 border-r pr-2 sm:left-10 sm:pr-4">
          <div className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <Menu />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-[400px] pt-16 sm:w-[540px]" side="left">
        {/* <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader> */}

        <Link href="/">
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New chat
          </Button>
        </Link>

        <div className="mt-8 flex flex-col gap-2">
          {chats.map((chat) => (
            <SheetClose key={chat.id}>
              <Link
                href={`/chat/${chat.id}`}
                className={cn(
                  "flex items-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                  {
                    "bg-accent text-accent-foreground":
                      chatId === chat.id.toString(),
                  },
                )}
              >
                <MessageCircle className="mr-2 inline-block h-4 w-4" />
                <span className="overflow-hidden truncate text-ellipsis whitespace-nowrap text-sm">
                  {chat.pdfName}
                </span>
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSidebar;
