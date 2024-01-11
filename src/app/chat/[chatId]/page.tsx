import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ChatSidebar from "~/components/custom/Chat/ChatSidebar";
import { db } from "~/server/db";
import { chats } from "~/server/db/schema";

type Props = {
  params: {
    chatId: string;
  };
};

const Chat = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const chatsData = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  if (!chatsData) {
    return redirect("/");
  }

  if (!chatsData.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  return (
    <div>
      <ChatSidebar chats={chatsData} chatId={chatId} />
    </div>
  );
};

export default Chat;
