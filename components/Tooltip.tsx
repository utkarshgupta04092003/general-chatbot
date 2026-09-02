"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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
            <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-e4 text-[10px] text-primary whitespace-nowrap backdrop-blur-md">
              {content}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
