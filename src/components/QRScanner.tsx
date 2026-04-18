'use client';

import { useState, useRef, useCallback } from 'react';
import QrScanner from 'qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageManager } from '@/lib/storage';
import { UserProgress } from '@/types';

interface QRScannerProps {
  onScanSuccess: (qrId: string) => void;
  userProgress: UserProgress;
}

export default function QRScanner({ onScanSuccess, userProgress }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [alreadyFound, setAlreadyFound] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const stopScanning = useCallback(() => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const handleScanResult = useCallback((scannedData: string) => {
    stopScanning();

    const validQR = StorageManager.validateQRCode(scannedData);
    if (!validQR) {
      setError('올바르지 않은 QR 코드입니다. 보물찾기 QR 코드를 스캔해주세요!');
      return;
    }

    const qrId = validQR.replace('treasure-hunt-', '');
    
    if (userProgress.foundCodes.includes(qrId)) {
      setAlreadyFound(true);
      return;
    }

    onScanSuccess(qrId);
  }, [stopScanning, onScanSuccess, userProgress.foundCodes]);

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setError('');
      setAlreadyFound(false);

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleScanResult(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
      setIsScanning(true);
    } catch (err) {
      setError('카메라 접근이 거부되었습니다. 카메라 권한을 허용해주세요.');
      console.error('QR Scanner error:', err);
    }
  }, [handleScanResult]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-sm">
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ display: isScanning ? 'block' : 'none' }}
          />
          
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">스캔 준비 완료!</p>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-2 border-yellow-400 rounded-xl animate-pulse" />
              <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
              <div className="absolute bottom-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl max-w-sm w-full"
          >
            <p className="text-red-600 text-sm text-center">{error}</p>
          </motion.div>
        )}

        {alreadyFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-blue-50 border border-blue-200 rounded-xl max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">이미 찾은 보물!</h3>
            <p className="text-blue-700 text-sm">이미 찾은 보물이에요. 새로운 보물을 계속 찾아보세요!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        {!isScanning ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startScanning}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            스캔 시작
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopScanning}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            스캔 중지
          </motion.button>
        )}
      </div>
    </div>
  );
}
