"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LawWatermarkProps {
  className?: string;
  type?: 'scales' | 'pillar';
}

export function LawWatermark({ className, type = 'scales' }: LawWatermarkProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] z-0 flex items-center justify-center", className)}>
      {type === 'scales' && (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[120%] h-[120%] text-legal-red"
          initial={{ rotate: -5, scale: 0.9 }}
          animate={{ rotate: 5, scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="M7 21h10"/>
          <path d="M12 3v18"/>
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
        </motion.svg>
      )}
      
      {type === 'pillar' && (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[100%] h-[100%] text-legal-red"
          initial={{ opacity: 0.5, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <path d="M4 20h16"/>
          <path d="M4 4h16"/>
          <path d="M6 4v16"/>
          <path d="M10 4v16"/>
          <path d="M14 4v16"/>
          <path d="M18 4v16"/>
        </motion.svg>
      )}
    </div>
  );
}
