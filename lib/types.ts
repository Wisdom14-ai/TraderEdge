export interface User {
    id: string;
    email: string;
    name: string;
    plan: 'trial' | 'starter' | 'pro';
    trialEnd: string;
    createdAt: string;
}

export type Market = 'bursa' | 'us' | 'paper';
export type Strategy = 'swing' | 'intraday';
export type TradeStatus = 'open' | 'closed';
export type EmotionalState = 'calm' | 'confident' | 'anxious' | 'fearful' | 'greedy' | 'fomo' | 'revenge' | 'neutral' | 'excited' | 'frustrated';

export interface Trade {
    id: string;
    userId: string;
    ticker: string;
    market: Market;
    strategy: Strategy;
    status: TradeStatus;
    buyDate: string;
    buyTime: string;
    sellDate: string;
    sellTime: string;
    buyPrice: number;
    sellPrice: number;
    quantity: number;
    capitalUsed: number;
    fees: number;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    setupSource: string;
    entryThesis: string;
    exitReason: string;
    emotionEntry: EmotionalState;
    emotionExit: EmotionalState;
    lessons: string;
    tags: string[];
    createdAt: string;
}

export interface AIReview {
    id: string;
    tradeId: string;
    userId: string;
    reviewText: string;
    disciplineScore: number;
    patterns: string[];
    createdAt: string;
}

export interface DashboardMetrics {
    realizedPL: number;
    unrealizedPL: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    totalFees: number;
    bestTrade: Trade | null;
    worstTrade: Trade | null;
    totalTrades: number;
    winCount: number;
    lossCount: number;
}

export interface SubscriptionPlan {
    id: 'starter' | 'pro';
    name: string;
    price: number;
    currency: string;
    features: string[];
    highlighted?: boolean;
}

export type AccountType = 'cds' | 'brokerage_bursa' | 'brokerage_us' | 'paper';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface CapitalTransaction {
    id: string;
    userId: string;
    type: TransactionType;
    account: AccountType;
    amount: number;
    date: string;
    reference: string;
    note: string;
    createdAt: string;
}
