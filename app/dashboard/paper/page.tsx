'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { FileText, Plus, TrendingUp, Target, Activity, ChevronRight } from 'lucide-react';
import { useTrades } from '@/lib/context';
import { calculatePL, calculateMetrics, formatCurrency, formatPL, formatDate } from '@/lib/utils';

export default function PaperTradingPage() {
    const { trades } = useTrades();
    const paperTrades = useMemo(() => trades.filter(t => t.market === 'paper'), [trades]);
    const metrics = useMemo(() => calculateMetrics(paperTrades), [paperTrades]);

    const closedTrades = paperTrades.filter(t => t.status === 'closed');
    const openTrades = paperTrades.filter(t => t.status === 'open');

    return (
        <div className="paper-page">
            <style jsx>{`
        .paper-page { animation: fadeIn 0.4s ease; }
        .page-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .page-top h1 {
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .page-top p { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }
        .paper-badge {
          background: var(--warning-bg);
          color: var(--warning);
          border: 1px solid var(--warning-border);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 800;
        }
        .section-header {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-tertiary);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
        }
        .empty-state h3 {
          font-size: 16px;
          margin-bottom: 6px;
          color: var(--text-secondary);
        }
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="page-top">
                <div>
                    <h1>Paper Trading <span className="paper-badge">SIMULATION</span></h1>
                    <p>Test strategies and track paper trade performance separately</p>
                </div>
                <Link href="/dashboard/add-trade" className="btn btn-primary"><Plus size={16} /> Add Paper Trade</Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total P/L</div>
                    <div className="stat-value" style={{ color: metrics.realizedPL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatPL(metrics.realizedPL)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Win Rate</div>
                    <div className="stat-value">{metrics.winRate.toFixed(1)}%</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Trades</div>
                    <div className="stat-value">{paperTrades.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Open</div>
                    <div className="stat-value">{openTrades.length}</div>
                </div>
            </div>

            {/* Trades Table */}
            <div className="section-header"><Activity size={16} style={{ color: 'var(--accent-primary)' }} /> Paper Trades</div>
            {paperTrades.length === 0 ? (
                <div className="empty-state">
                    <h3>No Paper Trades</h3>
                    <p>Start logging paper trades to test your strategies risk-free.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Strategy</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Buy Price</th>
                                <th>Sell Price</th>
                                <th>P/L</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paperTrades.map(trade => {
                                const pl = calculatePL(trade);
                                return (
                                    <tr key={trade.id} className="table-row-link" onClick={() => window.location.href = `/dashboard/trade/${trade.id}`}>
                                        <td style={{ fontWeight: 700 }}>{trade.ticker}</td>
                                        <td><span className="badge badge-info">{trade.strategy}</span></td>
                                        <td><span className={`badge ${trade.status === 'open' ? 'badge-warning' : 'badge-success'}`}>{trade.status}</span></td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{formatDate(trade.buyDate)}</td>
                                        <td>{trade.buyPrice.toFixed(2)}</td>
                                        <td>{trade.status === 'closed' ? trade.sellPrice.toFixed(2) : '—'}</td>
                                        <td>
                                            {trade.status === 'closed' ? (
                                                <span style={{ fontWeight: 700, color: pl >= 0 ? 'var(--success)' : 'var(--danger)' }}>{formatPL(pl)}</span>
                                            ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                                        </td>
                                        <td><ChevronRight size={16} style={{ color: 'var(--text-muted)' }} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
