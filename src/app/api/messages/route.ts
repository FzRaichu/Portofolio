import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMessages } from "@/lib/messages";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  if (!verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await getMessages();
  return NextResponse.json(messages);
}
