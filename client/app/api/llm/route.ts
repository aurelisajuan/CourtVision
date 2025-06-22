import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.LLM_API_URL!;
const BACKEND_KEY = process.env.CUSTOM_LLM_API_KEY;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res  = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        ...(BACKEND_KEY
            ? { Authorization: `Bearer ${BACKEND_KEY}` }
            : {}),
        },
        body: JSON.stringify(body),
    });
    return NextResponse.json(await res.json(), { status: res.status });
}
