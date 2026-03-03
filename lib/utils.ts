import { Trade, DashboardMetrics } from './types';

export function formatCurrency(amount: number, currency: string = 'MYR'): string {
    if (currency === 'USD') {
        return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `RM${Math.abs(amount).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPL(amount: number, currency: string = 'MYR'): string {
    const prefix = amount >= 0 ? '+' : '-';
    return `${prefix}${formatCurrency(amount, currency)}`;
}

export function formatPercent(value: number): string {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatDateTime(dateStr: string, timeStr: string): string {
    if (!dateStr) return '—';
    const time = timeStr ? ` ${timeStr}` : '';
    return `${formatDate(dateStr)}${time}`;
}

export function calculatePL(trade: Trade): number {
    if (trade.status === 'open' || !trade.sellPrice) return 0;
    return (trade.sellPrice - trade.buyPrice) * trade.quantity - trade.fees;
}

export function calculateROI(trade: Trade): number {
    if (trade.status === 'open' || !trade.sellPrice || !trade.capitalUsed) return 0;
    const pl = calculatePL(trade);
    return (pl / trade.capitalUsed) * 100;
}

export function calculateUnrealizedPL(trade: Trade, currentPrice?: number): number {
    // Deterministic pseudo-random generation based on trade ID length/chars to avoid SSR mismatch
    const hash = trade.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (hash % 100) / 100; // 0.0 to 0.99

    const price = currentPrice || trade.buyPrice * (1 + (pseudoRandom * 0.1 - 0.03));
    return (price - trade.buyPrice) * trade.quantity - trade.fees;
}

export function calculateDaysHeld(buyDate: string): number {
    const buy = new Date(buyDate);
    // Fixed date for mock data to ensure deterministic SSR and prevent hydration mismatched
    const now = new Date('2026-03-02T12:00:00Z');
    return Math.floor((now.getTime() - buy.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDistanceToTarget(currentPrice: number, targetPrice: number): number {
    if (!targetPrice) return 0;
    return ((targetPrice - currentPrice) / currentPrice) * 100;
}

export function calculateMetrics(trades: Trade[]): DashboardMetrics {
    const closedTrades = trades.filter(t => t.status === 'closed');
    const plValues = closedTrades.map(t => calculatePL(t));
    const wins = plValues.filter(pl => pl > 0);
    const losses = plValues.filter(pl => pl < 0);

    const realizedPL = plValues.reduce((sum, pl) => sum + pl, 0);
    const openTrades = trades.filter(t => t.status === 'open');
    const unrealizedPL = openTrades.reduce((sum, t) => sum + calculateUnrealizedPL(t), 0);

    const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;
    const avgWin = wins.length > 0 ? wins.reduce((s, w) => s + w, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, l) => s + l, 0) / losses.length) : 0;
    const totalFees = trades.reduce((sum, t) => sum + t.fees, 0);

    let bestTrade: Trade | null = null;
    let worstTrade: Trade | null = null;
    if (closedTrades.length > 0) {
        bestTrade = closedTrades.reduce((best, t) => calculatePL(t) > calculatePL(best) ? t : best);
        worstTrade = closedTrades.reduce((worst, t) => calculatePL(t) < calculatePL(worst) ? t : worst);
    }

    return {
        realizedPL,
        unrealizedPL,
        winRate,
        avgWin,
        avgLoss,
        totalFees,
        bestTrade,
        worstTrade,
        totalTrades: closedTrades.length,
        winCount: wins.length,
        lossCount: losses.length,
    };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
