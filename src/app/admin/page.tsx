'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StorageManager } from '@/lib/storage';
import { TOTAL_QR_CODES } from '@/types';

export default function AdminPage() {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const generateAllQRCodes = () => {
    const qrCodes = [];
    for (let i = 1; i <= TOTAL_QR_CODES; i++) {
      qrCodes.push({
        id: `qr-${i}`,
        code: StorageManager.generateQRCode(`qr-${i}`),
        location: `Location ${i}`
      });
    }
    return qrCodes;
  };

  const qrCodes = generateAllQRCodes();

  const toggleCodeSelection = (codeId: string) => {
    setSelectedCodes(prev => 
      prev.includes(codeId) 
        ? prev.filter(id => id !== codeId)
        : [...prev, codeId]
    );
  };

  const selectAll = () => {
    setSelectedCodes(qrCodes.map(qr => qr.id));
  };

  const clearSelection = () => {
    setSelectedCodes([]);
  };

  const printSelected = () => {
    const selectedQRCodes = qrCodes.filter(qr => selectedCodes.includes(qr.id));
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Codes for Treasure Hunt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .qr-container { 
                display: inline-block; 
                margin: 20px; 
                text-align: center; 
                border: 2px solid #ddd; 
                padding: 15px; 
                border-radius: 10px;
                page-break-inside: avoid;
              }
              .qr-code { 
                font-size: 48px; 
                font-weight: bold; 
                margin-bottom: 10px;
                background: #f0f0f0;
                padding: 20px;
                border-radius: 5px;
              }
              .qr-id { 
                font-size: 18px; 
                font-weight: bold; 
                color: #333;
                margin-bottom: 5px;
              }
              .instructions { 
                font-size: 14px; 
                color: #666;
                margin-top: 10px;
              }
              @media print {
                .qr-container { 
                  margin: 10px; 
                  border: 1px solid #999;
                }
              }
            </style>
          </head>
          <body>
            <h1>Treasure Hunt QR Codes</h1>
            <p>Print these QR codes and hide them around the kids cafe!</p>
            ${selectedQRCodes.map(qr => `
              <div class="qr-container">
                <div class="qr-id">Treasure ${qr.id.replace('qr-', '')}</div>
                <div class="qr-code">${qr.code}</div>
                <div class="instructions">Scan this code with the Treasure Hunt app!</div>
              </div>
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
QR 코드 생성기
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
보물찾기 게임용 QR 코드를 생성하고 인쇄하세요
          </motion.p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
    인쇄할 QR 코드 선택 ({selectedCodes.length}개 선택됨)
              </h2>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={selectAll}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  모두 선택
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSelection}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  선택 지우기
                </motion.button>
                {selectedCodes.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={printSelected}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
                  >
                    선택된 것 인쇄 ({selectedCodes.length}개)
                  </motion.button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {qrCodes.map((qr, index) => (
                <motion.div
                  key={qr.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCodeSelection(qr.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedCodes.includes(qr.id)
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      #{index + 1}
                    </div>
                    <div className="text-xs text-gray-600 mb-2 break-all">
                      {qr.code}
                    </div>
                    <div className={`w-4 h-4 mx-auto rounded-full ${
                      selectedCodes.includes(qr.id) ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">
              QR 코드 사용 방법:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li>인쇄할 QR 코드를 클릭해서 선택하세요</li>
              <li>"선택된 것 인쇄"를 클릭해서 인쇄용 버전을 생성하세요</li>
              <li>QR 코드를 오려서 키즈카페 곳곳에 숨기세요</li>
              <li>찾기 쉽지만 너무 쉽지 않게 숨겨주세요!</li>
              <li>아이들이 보물찾기 앱으로 스캔할 수 있어요</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>팁:</strong> 다양한 난이도로 QR 코드를 숨기세요 - 쉬운 것과 어려운 것을 섞어서!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
