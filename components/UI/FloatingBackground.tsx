'use client';

import { motion } from 'framer-motion';
import { Scale, Book, FileText, Gavel, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

const ICONS = [Scale, Book, FileText, Gavel, Shield];

export function FloatingBackground() {
  const [elements, setElements] = useState<Array<{ id: number; Icon: any; x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate random elements on mount to avoid hydration mismatch
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 24 + 16, // 16px to 40px
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15, // 15s to 25s
    }));
    setElements(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-15 opacity-[0.03]">
      {elements.map((el) => {
        const { Icon } = el;
        return (
          <motion.div
            key={el.id}
            className="absolute text-legal-red"
            initial={{ 
              x: `${el.x}vw`, 
              y: `${el.y}vh`, 
              rotate: 0,
              opacity: 0
            }}
            animate={{
              y: [`${el.y}vh`, `${(el.y - 20 + 100) % 100}vh`],
              rotate: 360,
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Icon size={el.size} />
          </motion.div>
        );
      })}
    </div>
  );
}
