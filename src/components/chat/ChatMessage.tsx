import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, RefreshCw } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { Message } from '../../lib/database.types';

type Props = {
  ai?: boolean;
  message: string | Message;
  onRegenerate?: () => void;
  isLast?: boolean;
};

export default function ChatMessage({
  ai = false,
  message,
  onRegenerate,
  isLast,
}: Props) {
  const [copied, setCopied] = useState(false);

  const isAI = ai || (typeof message === 'object' && message.role === 'assistant');
  const content = typeof message === 'string' ? message : message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mr-3">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div className="max-w-[80%]">
        <div
          className={`rounded-3xl px-5 py-4 ${
            isAI
              ? 'bg-cyan-500/10 border border-cyan-500/20 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
          }`}
        >
          {isAI ? (
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          ) : (
            <p className="leading-relaxed">{content}</p>
          )}
        </div>

        {isAI && (
          <div className="flex items-center gap-2 mt-2 ml-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition"
              >
                <RefreshCw size={12} />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ml-3">
          <User size={20} className="text-white/60" />
        </div>
      )}
    </motion.div>
  );
}
