import { useMutation, useQuery } from "@tanstack/react-query";
import {
  generateAiTriageDraft,
  getAiSearchSuggestions,
  sendAiChatMessage,
} from "@/api/ai.api";

export const useAiChat = () => {
  return useMutation({
    mutationFn: sendAiChatMessage,
  });
};

export const useAiTriageDraft = () => {
  return useMutation({
    mutationFn: generateAiTriageDraft,
  });
};

export const useAiSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ["ai-search-suggestions", query],
    queryFn: () => getAiSearchSuggestions(query),
    staleTime: 20 * 1000,
  });
};
