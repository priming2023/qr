'use client';

import { motion } from 'framer-motion';
import { UserProgress, TOTAL_QR_CODES, MIN_COINS_FOR_PRIZE } from '@/types';

interface ProgressDisplayProps {
  userProgress: UserProgress;
}

export default function ProgressDisplay({ userProgress }: ProgressDisplayProps) {
  const progressPercentage = (userProgress.foundCodes.length / TOTAL_QR_CODES) * 100;
  const canRedeemPrize = userProgress.foundCodes.length >= MIN_COINS_FOR_PRIZE;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border-2 border-yellow-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">보물찾기 진행상황</h2>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-3xl font-bold text-yellow-600">{userProgress.foundCodes.length}</span>
          <span className="text-xl text-gray-600">/ {TOTAL_QR_CODES}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">찾은 보물</p>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">{progressPercentage.toFixed(0)}% 완료</p>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {Array.from({ length: TOTAL_QR_CODES }, (_, i) => {
          const isFound = userProgress.foundCodes.includes(`qr-${i + 1}`);
          return (
            <motion.div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                isFound
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFound ? '!' : '?'}
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        {userProgress.foundCodes.length < MIN_COINS_FOR_PRIZE ? (
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-800 font-semibold mb-2">
              힘내세요! 선물을 받으려면 {MIN_COINS_FOR_PRIZE - userProgress.foundCodes.length}개 더 찾아야 해요! 
            </p>
            <p className="text-blue-600 text-sm">
              정말 잘하고 있어요! 계속 보물을 찾아보세요!
            </p>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-green-800 font-bold text-lg mb-2">
              대단해요! 이제 선물을 받을 수 있어요! 
            </p>
            <p className="text-green-600 text-sm">
              {userProgress.foundCodes.length}개의 보물을 찾은 것을 축하해요!
            </p>
          </div>
        )}
      </div>

      {userProgress.isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-center"
        >
          <h3 className="text-white font-bold text-xl mb-2">당신은 보물찾기의 왕!</h3>
          <p className="text-white text-lg">진정한 월드킹 축하합니다! </p>
          <p className="text-white text-sm mt-2">모든 보물을 찾았어요! 정말 대단해요!</p>
        </motion.div>
      )}
    </div>
  );
}
