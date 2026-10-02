import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteMessage, updateMessage } from "@/lib/messages";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

async function requireOwner() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { read, priority } = (body ?? {}) as {
    read?: unknown;
    priority?: unknown;
  };

  const patch: { read?: boolean; priority?: boolean } = {};
  if (typeof read === "boolean") patch.read = read;
  if (typeof priority === "boolean") patch.priority = priority;

  const next = await updateMessage(id, patch);
  if (!next) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }
  return NextResponse.json(next);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
