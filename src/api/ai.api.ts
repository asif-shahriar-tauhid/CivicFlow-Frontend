import apiClient from "@/lib/apiClient";
import type {
  AiChatResponse,
  AiSearchSuggestionsResponse,
  AiTriageDraftResponse,
} from "@/types/ai.types";
import type { ApiResponse } from "@/types/dashboard.types";

export const sendAiChatMessage = async (payload: {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}): Promise<ApiResponse<AiChatResponse>> => {
  return apiClient("/ai/chat", {
    method: "POST",
    body: payload,
  });
};

export const generateAiTriageDraft = async (payload: {
  prompt: string;
}): Promise<ApiResponse<AiTriageDraftResponse>> => {
  return apiClient("/ai/triage-draft", {
    method: "POST",
    body: payload,
  });
};

export const getAiSearchSuggestions = async (
  q: string,
): Promise<ApiResponse<AiSearchSuggestionsResponse>> => {
  return apiClient("/ai/search-suggestions", {
    method: "GET",
    query: { q },
  });
};
