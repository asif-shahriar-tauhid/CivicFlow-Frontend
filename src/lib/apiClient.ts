import { ofetch } from "ofetch";

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
});

export default apiClient;
