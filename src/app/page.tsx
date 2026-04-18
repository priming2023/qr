'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRScanner from '@/components/QRScanner';
import ProgressDisplay from '@/components/ProgressDisplay';
import PrizeRedemption from '@/components/PrizeRedemption';
import SuccessAnimation from '@/components/SuccessAnimation';
import { StorageManager } from '@/lib/storage';
import { UserProgress, TOTAL_QR_CODES, MIN_COINS_FOR_PRIZE } from '@/types';

export default function Home() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    foundCodes: [],
    totalCoins: 0,
    canRedeemPrize: false,
    isComplete: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentView, setCurrentView] = useState<'scan' | 'prize'>('scan');

  useEffect(() => {
    const progress = StorageManager.getUserProgress();
    setUserProgress(progress);
  }, []);

  const handleQRFound = (qrId: string) => {
    setShowSuccess(true);
    
    const newProgress = {
      ...userProgress,
      foundCodes: [...userProgress.foundCodes, qrId],
      totalCoins: userProgress.totalCoins + 1,
      canRedeemPrize: userProgress.foundCodes.length + 1 >= MIN_COINS_FOR_PRIZE,
      isComplete: userProgress.foundCodes.length + 1 === TOTAL_QR_CODES
    };

    setUserProgress(newProgress);
    StorageManager.saveUserProgress(newProgress);
  };

  const handlePrizeRedeemed = () => {
    setCurrentView('scan');
  };

  const canRedeemPrize = userProgress.foundCodes.length >= MIN_COINS_FOR_PRIZE && StorageManager.canRedeemPrizeToday();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
          >
보물찾기 모험!
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
숨겨진 QR 코드를 찾아서 멋진 선물을 받으세요!
          </motion.p>
        </header>

        <main className="space-y-8">
          <ProgressDisplay userProgress={userProgress} />

          {!userProgress.isComplete && canRedeemPrize && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('prize')}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
              >
선물 받기!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('scan')}
                className={`px-8 py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg ${
                  currentView === 'scan'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
더 찾아보기!
              </motion.button>
            </motion.div>
          )}

          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center"
          >
            {currentView === 'scan' ? (
              <QRScanner
                onScanSuccess={handleQRFound}
                userProgress={userProgress}
              />
            ) : (
              <PrizeRedemption
                userProgress={userProgress}
                onPrizeRedeemed={handlePrizeRedeemed}
              />
            )}
          </motion.div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>즐거운 보물찾기! 모든 {TOTAL_QR_CODES}개 보물을 찾아 보물의 왕이 되세요!</p>
        </footer>
      </div>

      <SuccessAnimation show={showSuccess} onHide={() => setShowSuccess(false)} />
    </div>
  );
}
