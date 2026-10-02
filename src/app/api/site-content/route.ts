import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSiteContent, saveSiteContent } from "@/lib/kv";
import { EDITABLE_FIELDS, validateContentField, type SiteContent } from "@/lib/site-content";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const patch: Partial<SiteContent> = {};
  for (const field of EDITABLE_FIELDS) {
    const value = (body as Record<string, unknown>)[field];
    if (value === undefined) continue;
    if (typeof value !== "string") return NextResponse.json({ error: `${field} must be text.` }, { status: 400 });
    const trimmed = value.trim();
    const error = validateContentField(field, trimmed);
    if (error) return NextResponse.json({ error }, { status: 400 });
    patch[field] = trimmed;
  }
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });

  try {
    const next = await saveSiteContent(patch);
    return NextResponse.json(next);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 }
    );
  }
}
