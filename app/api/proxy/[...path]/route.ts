import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { rateLimit } from "@/lib/rate-limit";

// Prevent this route from being cached by Next.js itself, we want to control caching manually
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://57.129.119.217:9090/api";

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = `/${params.path.join("/")}`;
    const url = `${BACKEND_URL}${path}`;
    const method = req.method;

    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = await rateLimit(ip);

    if (!limit.success) {
        return NextResponse.json(
            { success: false, message: "Too many requests" },
            { status: 429, headers: { "Retry-After": String(limit.reset) } }
        );
    }

    // 2. Caching (GET only)
    const cacheKey = `api-cache:${method}:${path}:${req.nextUrl.searchParams.toString()}`;

    if (method === "GET") {
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log(`Cache HIT for ${path}`);
            return NextResponse.json(JSON.parse(cached));
        }
    }

    // 3. Forward Request
    try {
        const headers = new Headers(req.headers);
        headers.delete("host"); // Avoid host mismatch issues

        // Forward the Authorization header if present
        const authHeader = req.headers.get("authorization");
        if (authHeader) {
            headers.set("Authorization", authHeader);
        }

        const body = method !== "GET" && method !== "HEAD" ? await req.text() : undefined;

        console.log(`Proxying ${method} request to: ${url}`);

        const response = await fetch(url + req.nextUrl.search, {
            method,
            headers,
            body,
            cache: "no-store"
        });

        const data = await response.json();

        // 4. Cache Response (GET only, successful responses)
        if (method === "GET" && response.ok) {
            // Cache for 60 seconds
            await redis.setex(cacheKey, 60, JSON.stringify(data));
        }

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
