import "server-only";
import { Redis } from "@upstash/redis";

const MESSAGES_KEY = "portfolio:messages";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  priority: boolean;
};

let client: Redis | null = null;
let warned = false;

function getClient(): Redis | null {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warned) {
      console.warn(
        "[messages] UPSTASH_REDIS_REST_URL/TOKEN not set — contact messages will not be stored."
      );
      warned = true;
    }
    return null;
  }
  client = new Redis({ url, token });
  return client;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const redis = getClient();
  if (!redis) return [];
  const stored =
    (await redis.hgetall<Record<string, ContactMessage>>(MESSAGES_KEY)) ?? {};
  return Object.values(stored).sort((a, b) => {
    if (a.priority !== b.priority) return a.priority ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function addMessage(
  input: Pick<ContactMessage, "name" | "email" | "message">
): Promise<ContactMessage | null> {
  const redis = getClient();
  if (!redis) return null;
  const entry: ContactMessage = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
    read: false,
    priority: false,
  };
  await redis.hset(MESSAGES_KEY, { [entry.id]: entry });
  return entry;
}

export async function updateMessage(
  id: string,
  patch: Partial<Pick<ContactMessage, "read" | "priority">>
): Promise<ContactMessage | null> {
  const redis = getClient();
  if (!redis) return null;
  const existing = await redis.hget<ContactMessage>(MESSAGES_KEY, id);
  if (!existing) return null;
  const next: ContactMessage = { ...existing, ...patch };
  await redis.hset(MESSAGES_KEY, { [id]: next });
  return next;
}

export async function deleteMessage(id: string): Promise<void> {
  const redis = getClient();
  if (!redis) return;
  await redis.hdel(MESSAGES_KEY, id);
}
