export interface AiChatActionLink {
  label: string;
  href: string;
}

export interface AiChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  referencedTicket?: {
    id: string;
    requestNumber: string;
    title: string;
    status: string;
    priority: string;
    categoryName: string;
    departmentName: string;
  } | null;
  suggestedActions?: AiChatActionLink[];
  followUpPrompts?: string[];
}

export interface AiChatResponse {
  reply: string;
  intent:
    | "TICKET_LOOKUP"
    | "SLA_AND_FEES"
    | "REPORT_GUIDANCE"
    | "REOPEN_POLICY"
    | "GENERAL_CIVIC";
  referencedTicket?: {
    id: string;
    requestNumber: string;
    title: string;
    status: string;
    priority: string;
    categoryName: string;
    departmentName: string;
  } | null;
  suggestedActions: AiChatActionLink[];
  followUpPrompts: string[];
}

export interface AiTriageDraftResponse {
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  departmentName: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  caseType: "COMPLAINT" | "SERVICE_REQUEST";
  slaHours: number;
  feeAmount: number;
  extractedLocation: {
    address?: string;
    ward?: string;
    zone?: string;
    landmark?: string;
  };
  confidence: number;
  reasoning: string;
}

export interface AiSearchSuggestionItem {
  id: string;
  text: string;
  type: "QUERY" | "LIVE_TICKET" | "CATEGORY" | "WARD_HOTSPOT";
  categoryName?: string;
  priority?: string;
  ticketId?: string;
  requestNumber?: string;
  reason: string;
}

export interface AiSearchSuggestionsResponse {
  query: string;
  suggestions: AiSearchSuggestionItem[];
  trendingTags: {
    label: string;
    query: string;
    category?: string;
    count: number;
  }[];
  aiFilterHint?: {
    categoryName?: string;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    status?: string;
    summary: string;
  } | null;
}
