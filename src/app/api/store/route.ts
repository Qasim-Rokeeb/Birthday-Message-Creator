// src/app/api/store/route.ts
import { NextRequest, NextResponse } from "next/server";

const store = new Map<string, any>();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id   = Math.random().toString(36).slice(2, 8); // 6-char key
  store.set(id, body);
  return NextResponse.json({ id });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const store = new Map<string, any>();
  const data = store.get(id as string);
  return data ? NextResponse.json(data) : NextResponse.json(null, { status: 404 });
}