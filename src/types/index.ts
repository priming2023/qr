export interface QRCode {
  id: string;
  location: string;
  found: boolean;
  foundAt?: Date;
}

export interface UserProgress {
  foundCodes: string[];
  totalCoins: number;
  lastPrizeRedemption?: Date;
  canRedeemPrize: boolean;
  isComplete: boolean;
}

export interface PrizeInfo {
  date: string;
  foundCount: number;
  message: string;
}

export const TOTAL_QR_CODES = 20;
export const MIN_COINS_FOR_PRIZE = 10;
