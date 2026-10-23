"use client";

import {
  ArrowRight,
  Bot,
  MessageSquareText,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAiChat } from "@/hooks/ai.hooks";
import type { AiChatMessageItem } from "@/types/ai.types";

const INITIAL_MESSAGES: AiChatMessageItem[] = [
  {
    id: "welcome-msg",
    role: "assistant",
    content:
      "Hello! I am the **CivicFlow Municipal AI Assistant**. I have live access to the ward grievance ledger, department SLA rules, and bKash tariff configs.\n\nAsk me to track a ticket (e.g. `CIV-2026-06303370`), explain SLA timelines, or guide you on reporting an issue!",
    timestamp: "Live AI",
    suggestedActions: [
      { label: "Explore Public Ledger", href: "/explore" },
      { label: "Report an Issue", href: "/citizen/report" },
    ],
    followUpPrompts: [
      "Check status of CIV-2026-06303370",
      "What are the SLA timelines and fees?",
      "How does the 7-day reopen guarantee work?",
      "How do I file a new grievance?",
    ],
  },
];

export function AiCivicAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] =
    useState<AiChatMessageItem[]>(INITIAL_MESSAGES);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { mutate: sendChat, isPending } = useAiChat();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const cleanText = (textToSend ?? input).trim();
    if (!cleanText || isPending) return;

    const userMsg: AiChatMessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: cleanText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textToSend) setInput("");

    sendChat(
      {
        message: cleanText,
        history: nextHistory.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      },
      {
        onSuccess: (res) => {
          const data = res?.data;
          const aiMsg: AiChatMessageItem = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content:
              data?.reply ||
              "I checked the municipal ledger. Please let me know if you need ticket tracking or SLA details.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            referencedTicket: data?.referencedTicket || null,
            suggestedActions: data?.suggestedActions || [],
            followUpPrompts: data?.followUpPrompts || [],
          };
          setMessages((prev) => [...prev, aiMsg]);
        },
        onError: () => {
          const fallbackMsg: AiChatMessageItem = {
            id: `ai-err-${Date.now()}`,
            role: "assistant",
            content:
              "I couldn't reach the backend AI service right now, but you can browse all live tickets in `/explore` or file an issue in `/citizen/report`.",
            timestamp: "Now",
            suggestedActions: [
              { label: "Open Explore Page", href: "/explore" },
              { label: "Report an Issue", href: "/citizen/report" },
            ],
          };
          setMessages((prev) => [...prev, fallbackMsg]);
        },
      },
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          role="dialog"
          aria-label="CivicFlow AI Municipal Assistant"
          className="mb-3 flex h-[520px] max-h-[80vh] w-[360px] sm:w-[400px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3.5 text-primary-foreground">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary-foreground/15">
                <Bot className="size-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold leading-none">
                    CivicFlow AI Assistant
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-100">
                    <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    LIVE DB
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-primary-foreground/80">
                  SLA Support • Live Ticket Telemetry • Triage Guide
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground transition-colors cursor-pointer"
              aria-label="Close AI Assistant"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div
            ref={scrollContainerRef}
            className="flex-1 space-y-4 overflow-y-auto p-4 bg-background/60"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
                    {isUser ? (
                      <>
                        <span>You</span>
                        <User className="size-3 text-primary" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3 text-primary" />
                        <span className="font-semibold text-foreground">
                          CivicFlow AI
                        </span>
                      </>
                    )}
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "border border-border bg-card text-foreground shadow-2xs rounded-bl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Live Referenced Ticket Card */}
                  {msg.referencedTicket && (
                    <div className="w-[90%] rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary">
                          {msg.referencedTicket.requestNumber}
                        </span>
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px]"
                        >
                          {msg.referencedTicket.status}
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground line-clamp-1">
                        {msg.referencedTicket.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {msg.referencedTicket.categoryName} •{" "}
                        {msg.referencedTicket.departmentName}
                      </p>
                      <Link
                        href={`/citizen/requests/${msg.referencedTicket.id}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline pt-1"
                      >
                        <span>Open Public Dossier</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  )}

                  {/* Suggested Navigation Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.suggestedActions.map((act) => (
                        <Link
                          key={act.href + act.label}
                          href={act.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Quick Follow-Up Prompts */}
                  {msg.followUpPrompts && msg.followUpPrompts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.followUpPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSendMessage(prompt)}
                          disabled={isPending}
                          className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground transition-colors text-left cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isPending && (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-muted-foreground w-fit">
                <Spinner className="size-3.5 text-primary" />
                <span>Querying CivicFlow ledger &amp; AI engine...</span>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SLA, fees, or ticket CIV-2026-..."
              className="h-9 text-xs bg-background"
              disabled={isPending}
            />
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!input.trim() || isPending}
              className="h-9 px-3 shrink-0"
              aria-label="Send message"
            >
              <Send className="size-3.5" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2.5 rounded-full bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all cursor-pointer"
        aria-label="Toggle CivicFlow AI Assistant"
      >
        <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
        <span>{isOpen ? "Close AI Assistant" : "AI Civic Assistant"}</span>
        {!isOpen && (
          <MessageSquareText className="size-3.5 opacity-80 hidden sm:inline" />
        )}
      </button>
    </div>
  );
}
