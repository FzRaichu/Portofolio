import "server-only";
import { cache } from "react";
import { Redis } from "@upstash/redis";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content";

const CONTENT_KEY = "portfolio:site-content";
const FIELDS_KEY = "portfolio:site-content:fields";

let client: Redis | null = null;
let warned = false;

function getClient(): Redis | null {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warned) {
      console.warn(
        "[site-content] UPSTASH_REDIS_REST_URL/TOKEN not set — serving default content and edits will not persist."
      );
      warned = true;
    }
    return null;
  }
  client = new Redis({ url, token });
  return client;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const redis = getClient();
  if (!redis) return defaultSiteContent;
  try {
    const [stored, fields] = await Promise.all([
      redis.get<Partial<SiteContent>>(CONTENT_KEY),
      redis.hgetall<Partial<SiteContent>>(FIELDS_KEY),
    ]);
    return { ...defaultSiteContent, ...stored, ...fields };
  } catch (err) {
    console.error("[site-content] Redis read failed, using defaults", err);
    return defaultSiteContent;
  }
});

export async function saveSiteContent(
  patch: Partial<SiteContent>
): Promise<SiteContent> {
  const redis = getClient();
  if (!redis) {
    throw new Error(
      "Content storage isn't configured (missing UPSTASH_REDIS_REST_URL/TOKEN)."
    );
  }
  // Each field is written independently, so concurrent edits don't lose data.
  await redis.hset(FIELDS_KEY, patch);
  return { ...(await getSiteContent()), ...patch };
}
