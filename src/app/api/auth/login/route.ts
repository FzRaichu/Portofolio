import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

const OWNER_NAME = "Ferciano";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, password } = (body ?? {}) as {
    name?: unknown;
    password?: unknown;
  };

  const nameOk = typeof name === "string" && name.trim() === OWNER_NAME;
  const hashB64 = process.env.AUTH_PASSWORD_HASH_B64;
  const hash = hashB64
    ? Buffer.from(hashB64, "base64").toString("utf8")
    : undefined;

  const passwordOk =
    nameOk && hash && typeof password === "string"
      ? await bcrypt.compare(password, hash)
      : false;

  if (!nameOk || !passwordOk) {
    return NextResponse.json(
      { error: "Invalid name or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
