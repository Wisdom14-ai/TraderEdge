'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, TrendingUp, TrendingDown, Calendar, Clock,
    Target, DollarSign, Brain, Lock, Tag, MessageSquare
} from 'lucide-react';
import { useTrades, useUser } from '@/lib/context';
import { calculatePL, calculateROI, calculateDaysHeld, formatCurrency, formatPL, formatPercent, formatDate, formatDateTime } from '@/lib/utils';

export default function TradeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { trades } = useTrades();
    const { isPro } = useUser();
    const tradeId = params.id as string;

    const trade = trades.find(t => t.id === tradeId);

    if (!trade) {
        return (
            <div style={{ textAlign: 'center', padding: 60 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Trade Not Found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>The trade you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/dashboard/history" className="btn btn-primary">Back to History</Link>
            </div>
        );
    }

    const pl = calculatePL(trade);
    const roi = calculateROI(trade);
    const daysHeld = calculateDaysHeld(trade.buyDate);
    const rMultiple = trade.stopLoss > 0 ? pl / ((trade.buyPrice - trade.stopLoss) * trade.quantity) : 0;

    return (
        <div className="trade-detail">
            <style jsx>{`
        .trade-detail { animation: fadeIn 0.4s ease; }
        .detail-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }
        .back-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .back-btn:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .detail-ticker {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .detail-badges { display: flex; gap: 8px; margin-left: auto; }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .metric-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 18px;
        }
        .metric-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .metric-value {
          font-size: 22px;
          font-weight: 800;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .detail-section {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 14px;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-key { color: var(--text-secondary); }
        .detail-val { font-weight: 600; text-align: right; }

        .journal-section {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
        }
        .journal-block {
          margin-bottom: 20px;
        }
        .journal-block:last-child { margin-bottom: 0; }
        .journal-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }
        .journal-text {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          background: var(--bg-secondary);
          padding: 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }
        .tags-list { display: flex; gap: 6px; flex-wrap: wrap; }

        .ai-section {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          position: relative;
        }
        .ai-locked-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 14, 23, 0.75);
          backdrop-filter: blur(6px);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 5;
        }
        .ai-content {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          background: var(--bg-secondary);
          padding: 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        @media (max-width: 1024px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .detail-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .metrics-grid { grid-template-columns: 1fr; }
          .detail-header { flex-wrap: wrap; }
          .detail-badges { margin-left: 0; }
        }
      `}</style>

            {/* Header */}
            <div className="detail-header">
                <button className="back-btn" onClick={() => router.back()}><ArrowLeft size={20} /></button>
                <span className="detail-ticker">{trade.ticker}</span>
                <div className="detail-badges">
                    <span className="badge badge-neutral">{trade.market.toUpperCase()}</span>
                    <span className="badge badge-info">{trade.strategy}</span>
                    <span className={`badge ${trade.status === 'open' ? 'badge-warning' : 'badge-success'}`}>{trade.status}</span>
                </div>
            </div>

            {/* Trade Metrics */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-label">P/L</div>
                    <div className="metric-value" style={{ color: trade.status === 'closed' ? (pl >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text-muted)' }}>
                        {trade.status === 'closed' ? formatPL(pl) : '—'}
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">ROI</div>
                    <div className="metric-value" style={{ color: trade.status === 'closed' ? (roi >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text-muted)' }}>
                        {trade.status === 'closed' ? formatPercent(roi) : '—'}
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Days Held</div>
                    <div className="metric-value">{daysHeld}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">R-Multiple</div>
                    <div className="metric-value" style={{ color: rMultiple > 0 ? 'var(--success)' : rMultiple < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {trade.stopLoss > 0 ? `${rMultiple.toFixed(2)}R` : '—'}
                    </div>
                </div>
            </div>

            {/* Trade Details */}
            <div className="detail-grid">
                <div className="detail-section">
                    <div className="section-title"><DollarSign size={18} style={{ color: 'var(--accent-primary)' }} /> Price & Timing</div>
                    <div className="detail-row"><span className="detail-key">Buy Date</span><span className="detail-val">{formatDateTime(trade.buyDate, trade.buyTime)}</span></div>
                    {trade.status === 'closed' && <div className="detail-row"><span className="detail-key">Sell Date</span><span className="detail-val">{formatDateTime(trade.sellDate, trade.sellTime)}</span></div>}
                    <div className="detail-row"><span className="detail-key">Buy Price</span><span className="detail-val">{trade.buyPrice.toFixed(2)}</span></div>
                    {trade.status === 'closed' && <div className="detail-row"><span className="detail-key">Sell Price</span><span className="detail-val">{trade.sellPrice.toFixed(2)}</span></div>}
                    <div className="detail-row"><span className="detail-key">Quantity</span><span className="detail-val">{trade.quantity.toLocaleString()}</span></div>
                    <div className="detail-row"><span className="detail-key">Capital Used</span><span className="detail-val">{formatCurrency(trade.capitalUsed)}</span></div>
                    <div className="detail-row"><span className="detail-key">Fees</span><span className="detail-val">{formatCurrency(trade.fees)}</span></div>
                </div>

                <div className="detail-section">
                    <div className="section-title"><Target size={18} style={{ color: 'var(--accent-primary)' }} /> Risk Levels</div>
                    <div className="detail-row"><span className="detail-key">Stop Loss</span><span className="detail-val">{trade.stopLoss > 0 ? trade.stopLoss.toFixed(2) : '—'}</span></div>
                    <div className="detail-row"><span className="detail-key">Take Profit 1</span><span className="detail-val">{trade.takeProfit1 > 0 ? trade.takeProfit1.toFixed(2) : '—'}</span></div>
                    <div className="detail-row"><span className="detail-key">Take Profit 2</span><span className="detail-val">{trade.takeProfit2 > 0 ? trade.takeProfit2.toFixed(2) : '—'}</span></div>
                    <div className="detail-row"><span className="detail-key">Entry Emotion</span><span className="detail-val">{trade.emotionEntry}</span></div>
                    <div className="detail-row"><span className="detail-key">Exit Emotion</span><span className="detail-val">{trade.emotionExit}</span></div>
                    <div className="detail-row"><span className="detail-key">Setup Source</span><span className="detail-val">{trade.setupSource || '—'}</span></div>
                </div>
            </div>

            {/* Journal */}
            <div className="journal-section">
                <div className="section-title"><MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} /> Trade Journal</div>
                {trade.entryThesis && (
                    <div className="journal-block">
                        <div className="journal-label">Entry Thesis</div>
                        <div className="journal-text">{trade.entryThesis}</div>
                    </div>
                )}
                {trade.exitReason && (
                    <div className="journal-block">
                        <div className="journal-label">Exit Reason</div>
                        <div className="journal-text">{trade.exitReason}</div>
                    </div>
                )}
                {trade.lessons && (
                    <div className="journal-block">
                        <div className="journal-label">Lessons Learned</div>
                        <div className="journal-text">{trade.lessons}</div>
                    </div>
                )}
                {trade.tags.length > 0 && (
                    <div className="journal-block">
                        <div className="journal-label">Tags</div>
                        <div className="tags-list">
                            {trade.tags.map((tag, i) => (
                                <span key={i} className="badge badge-neutral">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Review */}
            <div className="ai-section">
                <div className="section-title"><Brain size={18} style={{ color: '#a78bfa' }} /> AI Trade Review</div>
                <div className="ai-content">
                    <p><strong>Analysis:</strong> This {trade.strategy} trade on {trade.ticker} shows {trade.emotionEntry === 'calm' || trade.emotionEntry === 'confident' ? 'good emotional discipline at entry' : 'potential emotional influence at entry'}. {trade.status === 'closed' ? (pl >= 0 ? `The trade resulted in a ${formatPercent(roi)} return.` : `The trade resulted in a loss of ${formatPL(pl)}.`) : 'Trade is still open.'}</p>
                    <br />
                    <p><strong>Discipline Check:</strong> {trade.stopLoss > 0 ? '✅ Stop loss was set.' : '⚠️ No stop loss defined.'} {trade.entryThesis ? '✅ Entry thesis documented.' : '⚠️ No entry thesis.'} {trade.lessons ? '✅ Lessons captured.' : '⚠️ No lessons documented.'}</p>
                    <br />
                    <p><strong>Pattern Alert:</strong> Entry emotion was &quot;{trade.emotionEntry}&quot; and exit was &quot;{trade.emotionExit}&quot;. {trade.emotionEntry === 'fomo' || trade.emotionEntry === 'revenge' ? '🚨 High-risk emotional state detected at entry. Review your process.' : 'Emotional states appear within normal range.'}</p>
                </div>
                {!isPro && (
                    <div className="ai-locked-overlay">
                        <Lock size={32} style={{ color: 'var(--text-muted)' }} />
                        <span className="badge badge-pro">PRO Feature</span>
                        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Upgrade to unlock AI trade reviews</span>
                        <Link href="/dashboard/settings" className="btn btn-primary btn-sm">Upgrade to Pro</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
