import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlossaryItem } from '../types';
import { MASTER_GLOSSARY } from '../constants';
import { Search, Loader2, Sparkles, X } from 'lucide-react';

interface SelectionDictionaryProps {
  onAskAssistant: (term: string) => void;
}

export const SelectionDictionary: React.FC<SelectionDictionaryProps> = ({ onAskAssistant }) => {
  const [popover, setPopover] = useState<{
    text: string;
    x: number;
    y: number;
    definition?: string;
    category?: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = (e: MouseEvent) => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (!selectedText || selectedText.length < 2 || selectedText.length > 50) {
        // If clicking outside the popover, close it
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setPopover(null);
        }
        return;
      }

      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        // Find in glossary
        const glossaryItem = MASTER_GLOSSARY.find(
          item => item.term.toLowerCase() === selectedText.toLowerCase()
        );

        setPopover({
          text: selectedText,
          x: rect.left + rect.width / 2,
          y: rect.top,
          definition: glossaryItem?.definition,
          category: glossaryItem?.category
        });
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  if (!popover) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed z-[1000] pointer-events-none"
      style={{ left: popover.x, top: popover.y }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10, x: '-50%' }}
        animate={{ opacity: 1, y: -10, x: '-50%' }}
        exit={{ opacity: 0, y: 10, x: '-50%' }}
        className="pointer-events-auto w-64 bg-executive-dark border border-perficient/40 shadow-2xl rounded-lg overflow-hidden backdrop-blur-xl"
      >
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-perficient/5">
          <div className="flex items-center gap-2">
            <Search className="w-3 h-3 text-perficient" />
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-white truncate max-w-[120px]">
              {popover.text}
            </span>
          </div>
          <button 
            onClick={() => setPopover(null)}
            className="text-white/20 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {popover.definition ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[0.5rem] px-1.5 py-0.5 rounded bg-perficient/20 text-perficient font-mono uppercase">
                  {popover.category}
                </span>
                <span className="text-[0.5rem] text-white/20 uppercase font-mono">Found in Glossary</span>
              </div>
              <p className="text-[0.6875rem] leading-relaxed text-white/80 font-mono italic">
                {popover.definition}
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-2 text-center">
              <p className="text-[0.625rem] text-white/40 italic">
                Term not in local glossary.
              </p>
            </div>
          )}

          <button
            onClick={() => {
              onAskAssistant(`Could you explain the term "${popover.text}" in a Director-level multi-agent QA context?`);
              setPopover(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-perficient/10 hover:bg-perficient text-white hover:text-black border border-perficient/20 rounded transition-all group"
          >
            <Sparkles className="w-3 h-3 group-hover:scale-110 transition-transform" />
            <span className="text-[0.5625rem] font-bold uppercase tracking-widest">Ask Deep Dive Assistant</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

