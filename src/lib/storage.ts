import { UserProgress, PrizeInfo } from '@/types';

const STORAGE_KEYS = {
  USER_PROGRESS: 'treasure-hunt-progress',
  DAILY_REDEMPTION: 'treasure-hunt-redemption',
  QR_CODES: 'treasure-hunt-qr-codes'
};

export class StorageManager {
  static getUserProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return {
        foundCodes: [],
        totalCoins: 0,
        canRedeemPrize: false,
        isComplete: false
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return stored ? JSON.parse(stored) : {
        foundCodes: [],
        totalCoins: 0,
        canRedeemPrize: false,
        isComplete: false
      };
    } catch {
      return {
        foundCodes: [],
        totalCoins: 0,
        canRedeemPrize: false,
        isComplete: false
      };
    }
  }

  static saveUserProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }

  static canRedeemPrizeToday(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const lastRedemption = localStorage.getItem(STORAGE_KEYS.DAILY_REDEMPTION);
      if (!lastRedemption) return true;

      const lastDate = new Date(lastRedemption);
      const today = new Date();
      
      return lastDate.toDateString() !== today.toDateString();
    } catch {
      return true;
    }
  }

  static recordPrizeRedemption(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_REDEMPTION, new Date().toISOString());
    } catch (error) {
      console.error('Failed to record prize redemption:', error);
    }
  }

  static generateQRCode(id: string): string {
    return `treasure-hunt-${id}`;
  }

  static validateQRCode(scannedCode: string): string | null {
    const qrCodes = Array.from({ length: 20 }, (_, i) => this.generateQRCode(`qr-${i + 1}`));
    return qrCodes.includes(scannedCode) ? scannedCode : null;
  }
}
