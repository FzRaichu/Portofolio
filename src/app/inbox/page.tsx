import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { InboxView } from "@/components/inbox-view";
import { getMessages } from "@/lib/messages";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export default async function InboxPage() {
  const cookieStore = await cookies();
  const isOwner = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!isOwner) notFound();

  const messages = await getMessages();

  return (
    <div className="mx-auto min-h-svh max-w-2xl px-6 py-16">
      <InboxView initialMessages={messages} />
    </div>
  );
}
