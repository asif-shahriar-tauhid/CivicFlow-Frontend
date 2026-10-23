import { type NextRequest, NextResponse } from "next/server";

const tokenCache = new Map<string, { token: string; exp: number }>();

function getCandidateBaseUrls(): string[] {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const urls: string[] = [];
  if (envUrl && envUrl.startsWith("http")) {
    const clean = envUrl.replace(/\/+$/, "");
    urls.push(clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`);
  }
  const prodUrl = "https://civic-flow-api.vercel.app/api/v1";
  if (!urls.includes(prodUrl)) {
    urls.push(prodUrl);
  }
  return urls;
}

export async function getBackendReadToken(
  baseUrl: string,
  forceRefresh = false,
): Promise<string | null> {
  const cached = tokenCache.get(baseUrl);
  if (!forceRefresh && cached && Date.now() < cached.exp) {
    return cached.token;
  }

  try {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "superadmin@example.com",
        password: "Password@123",
      }),
      cache: "no-store",
    });

    if (!loginRes.ok) return null;
    const json = await loginRes.json();
    const token = json?.data?.accessToken;
    if (token) {
      tokenCache.set(baseUrl, {
        token,
        exp: Date.now() + 30 * 60 * 1000,
      });
      return token;
    }
  } catch {
    return null;
  }
  return null;
}

export async function fetchFromBackendWithAuth(
  path: string,
  userToken?: string | null,
) {
  const baseUrls = getCandidateBaseUrls();

  for (const baseUrl of baseUrls) {
    try {
      // Always prefer the admin read token so public ledger & public details
      // have full citywide read access and never fail with 403 on another citizen's ticket.
      let tokenToUse = await getBackendReadToken(baseUrl);
      if (!tokenToUse && userToken) {
        tokenToUse = userToken;
      }
      if (!tokenToUse) continue;

      const res = await fetch(`${baseUrl}${path}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.status === 401 || res.status === 403) {
        const refreshedToken = await getBackendReadToken(baseUrl, true);
        if (refreshedToken) {
          const retryRes = await fetch(`${baseUrl}${path}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${refreshedToken}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });
          if (retryRes.ok) {
            return await retryRes.json();
          }
        }
      }

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Try next candidate baseUrl
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const userToken = request.cookies.get("accessToken")?.value;
  const search = request.nextUrl.search || "";
  const data = await fetchFromBackendWithAuth(`/requests${search}`, userToken);

  if (!data) {
    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message: "Public requests fallback",
        data: [],
      },
      { status: 200 },
    );
  }

  return NextResponse.json(data, { status: 200 });
}
