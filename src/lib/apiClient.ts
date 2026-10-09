import { ofetch } from "ofetch";
import { getClientAuthToken } from "./authUtils";

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // In production deployment:
    if (!isLocalhost) {
      // If envUrl is missing, or points to localhost, or is relative "/api/v1",
      // route via relative "/api/v1" so it uses Next.js rewrites on the same origin.
      if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1") || envUrl === "/api/v1") {
        return "/api/v1";
      }
    }
  }

  const raw = envUrl || "https://civic-flow-api.vercel.app/api/v1";
  const clean = raw.replace(/\/+$/, "");
  return clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
};

const BASE_URL = getBaseUrl();

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = getClientAuthToken();
    if (token) {
      const headers = new Headers(options.headers);
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      options.headers = headers;
    }
  },
});

export default apiClient;

