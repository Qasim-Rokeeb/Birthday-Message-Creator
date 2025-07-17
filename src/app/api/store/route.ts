// src/app/api/store/route.ts
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv(); // expects UPSTASH_URL & UPSTASH_TOKEN env vars

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = Math.random().toString(36).slice(2, 8); // 6-char key
  await redis.set(id, JSON.stringify(body), { ex: 60 * 60 * 24 }); // 24 h TTL
  return NextResponse.json({ id });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const raw = await redis.get(id as string);
  return raw
    ? NextResponse.json(raw)
    : NextResponse.json(null, { status: 404 });
}