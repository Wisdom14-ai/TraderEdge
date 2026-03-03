'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Briefcase, TrendingUp, TrendingDown, Clock, Target, AlertTriangle, Shield } from 'lucide-react';
import { useTrades } from '@/lib/context';
import { calculateUnrealizedPL, calculateDaysHeld, getDistanceToTarget, formatCurrency, formatPL } from '@/lib/utils';

export default function PositionsPage() {
    const { trades } = useTrades();
    const openPositions = useMemo(() => trades.filter(t => t.status === 'open' && t.market !== 'paper'), [trades]);

    const totalUnrealized = useMemo(() => openPositions.reduce((sum, t) => sum + calculateUnrealizedPL(t), 0), [openPositions]);
    const totalCapital = useMemo(() => openPositions.reduce((sum, t) => sum + t.capitalUsed, 0), [openPositions]);
    const totalRisk = useMemo(() => openPositions.reduce((sum, t) => {
        if (t.stopLoss > 0) return sum + (t.buyPrice - t.stopLoss) * t.quantity;
        return sum;
    }, 0), [openPositions]);

    return (
        <div className="positions-page">
            <style jsx>{`
        .positions-page { animation: fadeIn 0.4s ease; }
        .page-top {
          margin-bottom: 28px;
        }
        .page-top h1 { font-size: 24px; font-weight: 700; }
        .page-top p { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .summary-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .summary-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .summary-value {
          font-size: 26px;
          font-weight: 800;
        }

        .position-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .pos-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          cursor: pointer;
          transition: all var(--transition-normal);
        }
        .pos-card:hover {
          border-color: var(--border-primary);
          box-shadow: var(--shadow-md);
        }
        .pos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .pos-ticker {
          font-size: 20px;
          font-weight: 800;
        }
        .pos-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pos-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .pos-row-key { color: var(--text-secondary); }
        .pos-row-val { font-weight: 600; }

        .risk-bar {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }
        .risk-bar-label {
          font-size: 12px;
          color: var(--text-tertiary);
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
        }
        .risk-track {
          height: 6px;
          background: var(--bg-secondary);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }
        .risk-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-tertiary);
        }
        .empty-state h3 {
          font-size: 18px;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .summary-grid { grid-template-columns: 1fr; }
          .position-cards { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="page-top">
                <h1>Open Positions</h1>
                <p>Track your active trades and risk exposure</p>
            </div>

            {/* Summary */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-label"><TrendingUp size={14} /> Unrealized P/L</div>
                    <div className="summary-value" style={{ color: totalUnrealized >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatPL(totalUnrealized)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-label"><Briefcase size={14} /> Capital Deployed</div>
                    <div className="summary-value">{formatCurrency(totalCapital)}</div>
                </div>
                <div className="summary-card">
                    <div className="summary-label"><Shield size={14} /> Max Risk (to SL)</div>
                    <div className="summary-value" style={{ color: 'var(--danger)' }}>
                        {formatCurrency(totalRisk)}
                    </div>
                </div>
            </div>

            {/* Position Cards */}
            {openPositions.length === 0 ? (
                <div className="empty-state">
                    <h3>No Open Positions</h3>
                    <p>You have no active trades at the moment.</p>
                    <Link href="/dashboard/add-trade" className="btn btn-primary" style={{ marginTop: 16 }}>Add Trade</Link>
                </div>
            ) : (
                <div className="position-cards">
                    {openPositions.map(trade => {
                        const unrealized = calculateUnrealizedPL(trade);
                        const days = calculateDaysHeld(trade.buyDate);
                        const currentEst = trade.buyPrice + (unrealized + trade.fees) / trade.quantity;
                        const distTP1 = trade.takeProfit1 > 0 ? getDistanceToTarget(currentEst, trade.takeProfit1) : 0;
                        const distSL = trade.stopLoss > 0 ? getDistanceToTarget(currentEst, trade.stopLoss) : 0;
                        const tpProgress = trade.takeProfit1 > 0 ? Math.max(0, Math.min(100, ((currentEst - trade.buyPrice) / (trade.takeProfit1 - trade.buyPrice)) * 100)) : 0;

                        return (
                            <Link key={trade.id} href={`/dashboard/trade/${trade.id}`} style={{ textDecoration: 'none' }}>
                                <div className="pos-card">
                                    <div className="pos-header">
                                        <span className="pos-ticker">{trade.ticker}</span>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <span className="badge badge-neutral">{trade.market.toUpperCase()}</span>
                                            <span className="badge badge-info">{trade.strategy}</span>
                                        </div>
                                    </div>
                                    <div className="pos-rows">
                                        <div className="pos-row">
                                            <span className="pos-row-key">Buy Price</span>
                                            <span className="pos-row-val">{trade.buyPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="pos-row">
                                            <span className="pos-row-key">Quantity</span>
                                            <span className="pos-row-val">{trade.quantity.toLocaleString()}</span>
                                        </div>
                                        <div className="pos-row">
                                            <span className="pos-row-key">Days Held</span>
                                            <span className="pos-row-val" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Clock size={12} /> {days}
                                            </span>
                                        </div>
                                        <div className="pos-row">
                                            <span className="pos-row-key">Unrealized P/L</span>
                                            <span className="pos-row-val" style={{ color: unrealized >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                {formatPL(unrealized)}
                                            </span>
                                        </div>
                                        <div className="pos-row">
                                            <span className="pos-row-key">Distance to TP1</span>
                                            <span className="pos-row-val" style={{ color: 'var(--success)' }}>
                                                {trade.takeProfit1 > 0 ? `${distTP1.toFixed(1)}%` : '—'}
                                            </span>
                                        </div>
                                        <div className="pos-row">
                                            <span className="pos-row-key">Distance to SL</span>
                                            <span className="pos-row-val" style={{ color: 'var(--danger)' }}>
                                                {trade.stopLoss > 0 ? `${distSL.toFixed(1)}%` : '—'}
                                            </span>
                                        </div>
                                    </div>
                                    {trade.takeProfit1 > 0 && (
                                        <div className="risk-bar">
                                            <div className="risk-bar-label">
                                                <span>Progress to TP1</span>
                                                <span>{tpProgress.toFixed(0)}%</span>
                                            </div>
                                            <div className="risk-track">
                                                <div className="risk-fill" style={{ width: `${tpProgress}%`, background: tpProgress > 50 ? 'var(--success)' : 'var(--accent-primary)' }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
