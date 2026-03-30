"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
};

export function Tooltip({ content, children, delay = 0.2 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15, delay }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] pointer-events-none"
          >
            <div className="bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl text-[10px] text-indigo-300 whitespace-nowrap backdrop-blur-md">
              {content}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45 -mt-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
