'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, ChevronDown } from 'lucide-react';
import { useTrades } from '@/lib/context';
import { Trade, Market, Strategy, TradeStatus, EmotionalState } from '@/lib/types';

const EMOTIONS: EmotionalState[] = ['calm', 'confident', 'anxious', 'fearful', 'greedy', 'fomo', 'revenge', 'neutral', 'excited', 'frustrated'];

export default function AddTradePage() {
    const router = useRouter();
    const { addTrade } = useTrades();

    const [form, setForm] = useState({
        ticker: '', market: 'bursa' as Market, strategy: 'swing' as Strategy,
        status: 'closed' as TradeStatus, buyDate: '', buyTime: '', sellDate: '', sellTime: '',
        buyPrice: '', sellPrice: '', quantity: '', capitalUsed: '', fees: '',
        stopLoss: '', takeProfit1: '', takeProfit2: '',
        setupSource: '', entryThesis: '', exitReason: '',
        emotionEntry: 'neutral' as EmotionalState, emotionExit: 'neutral' as EmotionalState,
        lessons: '', tags: '',
    });

    const updateField = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trade: Trade = {
            id: `t${Date.now()}`,
            userId: 'u1',
            ticker: form.ticker.toUpperCase(),
            market: form.market,
            strategy: form.strategy,
            status: form.status,
            buyDate: form.buyDate,
            buyTime: form.buyTime,
            sellDate: form.sellDate,
            sellTime: form.sellTime,
            buyPrice: parseFloat(form.buyPrice) || 0,
            sellPrice: parseFloat(form.sellPrice) || 0,
            quantity: parseFloat(form.quantity) || 0,
            capitalUsed: parseFloat(form.capitalUsed) || 0,
            fees: parseFloat(form.fees) || 0,
            stopLoss: parseFloat(form.stopLoss) || 0,
            takeProfit1: parseFloat(form.takeProfit1) || 0,
            takeProfit2: parseFloat(form.takeProfit2) || 0,
            setupSource: form.setupSource,
            entryThesis: form.entryThesis,
            exitReason: form.exitReason,
            emotionEntry: form.emotionEntry,
            emotionExit: form.emotionExit,
            lessons: form.lessons,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            createdAt: new Date().toISOString(),
        };
        addTrade(trade);
        router.push('/dashboard/history');
    };

    return (
        <div className="add-trade">
            <style jsx>{`
        .add-trade { animation: fadeIn 0.4s ease; }
        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .form-header h1 { font-size: 24px; font-weight: 700; }
        .form-header p { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }
        .form-actions { display: flex; gap: 10px; }
        .form-body {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .form-section {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .form-section-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .span-full { grid-column: 1 / -1; }
        @media (max-width: 768px) {
          .form-grid, .form-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

            <form onSubmit={handleSubmit}>
                <div className="form-header">
                    <div>
                        <h1>Add Trade</h1>
                        <p>Log a new trade entry with all details</p>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
                            <X size={16} /> Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={16} /> Save Trade
                        </button>
                    </div>
                </div>

                <div className="form-body">
                    {/* Basic Info */}
                    <div className="form-section">
                        <div className="form-section-title">📋 Basic Information</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Ticker / Counter Name *</label>
                                <input className="input" placeholder="e.g. TOPGLOV, AAPL" value={form.ticker} onChange={e => updateField('ticker', e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Market *</label>
                                <select className="input" value={form.market} onChange={e => updateField('market', e.target.value)}>
                                    <option value="bursa">Bursa Malaysia</option>
                                    <option value="us">US Market</option>
                                    <option value="paper">Paper Trading</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Strategy *</label>
                                <select className="input" value={form.strategy} onChange={e => updateField('strategy', e.target.value)}>
                                    <option value="swing">Swing Trading</option>
                                    <option value="intraday">Intraday</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Trade Status *</label>
                                <select className="input" value={form.status} onChange={e => updateField('status', e.target.value)}>
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Setup Source</label>
                                <input className="input" placeholder="e.g. Breakout, MA Crossover" value={form.setupSource} onChange={e => updateField('setupSource', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Tags (comma-separated)</label>
                                <input className="input" placeholder="e.g. momentum, breakout, tech" value={form.tags} onChange={e => updateField('tags', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Timing */}
                    <div className="form-section">
                        <div className="form-section-title">💰 Pricing & Timing</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Buy Date *</label>
                                <input type="date" className="input" value={form.buyDate} onChange={e => updateField('buyDate', e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Buy Time</label>
                                <input type="time" className="input" value={form.buyTime} onChange={e => updateField('buyTime', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Buy Price *</label>
                                <input type="number" step="0.01" className="input" placeholder="0.00" value={form.buyPrice} onChange={e => updateField('buyPrice', e.target.value)} required />
                            </div>
                            {form.status === 'closed' && (
                                <>
                                    <div className="input-group">
                                        <label>Sell Date</label>
                                        <input type="date" className="input" value={form.sellDate} onChange={e => updateField('sellDate', e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Sell Time</label>
                                        <input type="time" className="input" value={form.sellTime} onChange={e => updateField('sellTime', e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Sell Price</label>
                                        <input type="number" step="0.01" className="input" placeholder="0.00" value={form.sellPrice} onChange={e => updateField('sellPrice', e.target.value)} />
                                    </div>
                                </>
                            )}
                            <div className="input-group">
                                <label>Quantity / Units *</label>
                                <input type="number" className="input" placeholder="0" value={form.quantity} onChange={e => updateField('quantity', e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Total Capital Used</label>
                                <input type="number" step="0.01" className="input" placeholder="0.00" value={form.capitalUsed} onChange={e => updateField('capitalUsed', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Fees</label>
                                <input type="number" step="0.01" className="input" placeholder="0.00" value={form.fees} onChange={e => updateField('fees', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Risk Levels */}
                    <div className="form-section">
                        <div className="form-section-title">🎯 Risk Levels</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Stop Loss</label>
                                <input type="number" step="0.01" className="input" placeholder="0.00" value={form.stopLoss} onChange={e => updateField('stopLoss', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Take Profit 1</label>
                                <input type="number" step="0.01" className="input" placeholder="0.00" value={form.takeProfit1} onChange={e => updateField('takeProfit1', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Take Profit 2</label>
                                <input type="number" step="0.01" className="input" placeholder="0.00" value={form.takeProfit2} onChange={e => updateField('takeProfit2', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Analysis & Journal */}
                    <div className="form-section">
                        <div className="form-section-title">🧠 Analysis & Journal</div>
                        <div className="form-grid-2">
                            <div className="input-group span-full">
                                <label>Entry Thesis</label>
                                <textarea className="input" rows={3} placeholder="Why did you enter this trade? What was your analysis?" value={form.entryThesis} onChange={e => updateField('entryThesis', e.target.value)} />
                            </div>
                            {form.status === 'closed' && (
                                <div className="input-group span-full">
                                    <label>Exit Reason</label>
                                    <textarea className="input" rows={3} placeholder="Why did you exit? Did you follow your plan?" value={form.exitReason} onChange={e => updateField('exitReason', e.target.value)} />
                                </div>
                            )}
                            <div className="input-group">
                                <label>Emotional State at Entry</label>
                                <select className="input" value={form.emotionEntry} onChange={e => updateField('emotionEntry', e.target.value)}>
                                    {EMOTIONS.map(e => (
                                        <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Emotional State at Exit</label>
                                <select className="input" value={form.emotionExit} onChange={e => updateField('emotionExit', e.target.value)}>
                                    {EMOTIONS.map(e => (
                                        <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group span-full">
                                <label>Lessons Learned</label>
                                <textarea className="input" rows={3} placeholder="What did you learn from this trade?" value={form.lessons} onChange={e => updateField('lessons', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
