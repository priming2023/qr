'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  show: boolean;
  onHide: () => void;
}

export default function SuccessAnimation({ show, onHide }: SuccessAnimationProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [show, onHide]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          보물을 찾았어요! 
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 mb-4"
        >
          정말 대단해요! 보물을 찾았어요!
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          className="flex justify-center space-x-2"
        >
          {['', '', '', '', ''].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
              className="w-3 h-3 bg-yellow-400 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
