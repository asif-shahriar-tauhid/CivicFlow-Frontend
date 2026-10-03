import { ofetch } from "ofetch";
import { getCookie } from "./cookieUtils";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://civic-flow-api.vercel.app/api/v1";

// Ensure trailing /api/v1 prefix is consistently applied
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const BASE_URL = cleanBaseUrl.endsWith("/api/v1")
  ? cleanBaseUrl
  : `${cleanBaseUrl}/api/v1`;

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = getCookie("accessToken");
    if (token) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
  },
});

export default apiClient;
