import { useEffect, useRef, useState, useCallback } from "react";
import { X, Bot } from "lucide-react";

import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import { TypingIndicator } from "./TypingIndicator";

import { streamGemini, askGemini } from "../../services/gemini.service";
import { useAuthStore } from "../../store/authStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ChatMessageData = {
  ai: boolean;
  message: string;
};

export default function AIChat({
  open,
  onClose,
}: Props) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      ai: true,
      message:
        "👋 Hello! I'm SchemeGPT-X AI. Ask me anything about Government Schemes, Scholarships, Eligibility, Documents or Benefits.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, streamingText]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        ai: false,
        message: text,
      },
    ]);

    setLoading(true);
    setStreamingText("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let fullText = "";

      if (user?.id) {
        fullText = await streamGemini(
          text,
          user.id,
          (chunk: string) => {
            setStreamingText((prev) => prev + chunk);
          },
          controller.signal
        );
      } else {
        fullText = await askGemini(text);
        setStreamingText(fullText);
      }

      setMessages((prev) => [
        ...prev,
        {
          ai: true,
          message: fullText || "I'm here to help with government schemes. Please ask your question.",
        },
      ]);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          {
            ai: true,
            message:
              "⚠️ Sorry, something went wrong while contacting SchemeGPT-X AI.",
          },
        ]);
      }
    }

    setStreamingText("");
    setLoading(false);
    abortRef.current = null;
  }, [loading, user?.id]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);

    if (streamingText) {
      setMessages((prev) => [
        ...prev,
        { ai: true, message: streamingText },
      ]);
    }
    setStreamingText("");
  }, [streamingText]);

  if (!open) return null;

  return (
        <div className="fixed bottom-28 right-8 z-[9999]">
      <div
        className="
          flex
          h-[700px]
          w-[430px]
          flex-col
          overflow-hidden
          rounded-[32px]
          border
          border-cyan-500/20
          bg-[#08111F]/95
          backdrop-blur-2xl
          shadow-[0_0_60px_rgba(0,255,255,.12)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500">
              <Bot className="text-white" />
            </div>

            <div>
              <h2 className="font-bold text-white">
                SchemeGPT-X AI
              </h2>

              <p className="text-sm text-cyan-300">
                Online
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-white/10"
          >
            <X className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              ai={msg.ai}
              message={msg.message}
            />
          ))}

          {loading && (
            <>
              {streamingText ? (
                <ChatMessage ai message={streamingText} />
              ) : (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested Questions */}
        <div className="border-t border-white/10 px-5 py-4">
          <SuggestedQuestions onSelect={(q) => handleSend(q)} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-white/10 p-5">
          <ChatInput onSend={handleSend} onStop={handleStop} isGenerating={loading} />
        </div>
      </div>
    </div>
  );
}
