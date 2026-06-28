import { useState } from 'react';
import AIFloatingButton from './ai/AIFloatingButton';
import AIChat from './chat/AIChat';

export default function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AIFloatingButton onClick={() => setOpen(!open)} />
      <AIChat open={open} onClose={() => setOpen(false)} />
    </>
  );
}
