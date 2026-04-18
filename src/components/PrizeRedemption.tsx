'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProgress } from '@/types';
import { StorageManager } from '@/lib/storage';

interface PrizeRedemptionProps {
  userProgress: UserProgress;
  onPrizeRedeemed: () => void;
}

export default function PrizeRedemption({ userProgress, onPrizeRedeemed }: PrizeRedemptionProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handlePrizeRedemption = () => {
    if (!StorageManager.canRedeemPrizeToday()) {
      alert('하루에 한 번만 선물을 받을 수 있어요. 내일 다시 오세요!');
      return;
    }

    setIsRedeeming(true);
    
    setTimeout(() => {
      StorageManager.recordPrizeRedemption();
      onPrizeRedeemed();
      setIsRedeeming(false);
    }, 2000);
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg border-2 border-purple-300">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </motion.div>

        <h2 className="text-2xl font-bold text-purple-800 mb-4">선물 시간!</h2>
        
        <div className="bg-white rounded-xl p-4 mb-6">
          <p className="text-lg text-gray-800 mb-2">
            <span className="font-bold">{today}</span>
          </p>
          <p className="text-xl font-bold text-purple-600 mb-1">
            {userProgress.foundCodes.length}개의 보물을 찾았어요!
          </p>
          <p className="text-lg text-pink-600 font-semibold">
            정말 대단해요! 당신은 정말 멋져요!
          </p>
        </div>

        {!isRedeeming ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrizeRedemption}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            선물 받기! 
          </motion.button>
        ) : (
          <div className="w-full px-8 py-4 bg-gray-200 rounded-xl text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="w-8 h-8 mx-auto mb-2 border-4 border-purple-500 border-t-transparent rounded-full"
            />
            <p className="text-gray-600 font-semibold">선물을 준비 중이에요...</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
          <p className="text-sm text-yellow-800">
            <span className="font-bold">알림:</span> 하루에 한 번만 선물을 받을 수 있어요. 
            더 많은 보물을 찾아서 더 큰 선물을 받으세요!
          </p>
        </div>
      </div>
    </div>
  );
}
