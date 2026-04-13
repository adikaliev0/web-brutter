import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const BOOT_TEXT = [
  "ИНИЦИАЛИЗАЦИЯ ЗАЩИЩЕННОГО ЯДРА v9.4.2...",
  "ЗАГРУЗКА МОДУЛЕЙ ШИФРОВАНИЯ [OK]",
  "УСТАНОВКА БЕЗОПАСНОГО СОЕДИНЕНИЯ...",
  "ОБХОД ФАЙРВОЛА [OK]",
  "МОНТИРОВАНИЕ ВИРТУАЛЬНЫХ ДИСКОВ...",
  "ВНИМАНИЕ: НЕСАНКЦИОНИРОВАННЫЙ ДОСТУП СТРОГО ЗАПРЕЩЕН.",
  "ПРОВЕРКА ЦЕЛОСТНОСТИ...",
  "СИСТЕМА ГОТОВА."
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_TEXT.length) {
        const text = BOOT_TEXT[currentLine];
        if (text) {
          setLines(prev => [...prev, text]);
        }
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col justify-end p-8 font-mono text-sm text-green-500">
      <div className="max-w-3xl w-full mx-auto space-y-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={line?.includes('ВНИМАНИЕ') ? 'text-red-500 font-bold' : ''}
          >
            {'>'} {line}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-3 h-4 bg-green-500 inline-block ml-2"
        />
      </div>
    </div>
  );
}
