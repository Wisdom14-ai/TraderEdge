'use client';

import React, { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, Target, Award,
    AlertTriangle, PieChart, BarChart3, Activity, Zap
} from 'lucide-react';
import { useTrades } from '@/lib/context';
import { calculatePL, calculateMetrics, formatCurrency, formatPL, formatPercent, formatDate, calculateROI } from '@/lib/utils';
import { Trade } from '@/lib/types';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, PieChart as RPieChart, Pie, Cell
} from 'recharts';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';

export default function DashboardPage() {
    const { trades } = useTrades();
    const [period, setPeriod] = useState<Period>('all');

    const realTrades = trades.filter(t => t.market !== 'paper');
    const metrics = useMemo(() => calculateMetrics(realTrades), [realTrades]);

    const closedTrades = realTrades.filter(t => t.status === 'closed');
    const openTrades = realTrades.filter(t => t.status === 'open');

    // Strategy breakdown
    const strategyData = useMemo(() => {
        const groups: Record<string, number> = {};
        closedTrades.forEach(t => {
            const pl = calculatePL(t);
            groups[t.strategy] = (groups[t.strategy] || 0) + pl;
        });
        return Object.entries(groups).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value: Math.round(value * 100) / 100 }));
    }, [closedTrades]);

    // Market breakdown
    const marketData = useMemo(() => {
        const groups: Record<string, number> = {};
        closedTrades.forEach(t => {
            const pl = calculatePL(t);
            groups[t.market] = (groups[t.market] || 0) + pl;
        });
        return Object.entries(groups).map(([name, value]) => ({ name: name.toUpperCase(), value: Math.round(value * 100) / 100 }));
    }, [closedTrades]);

    // Monthly P/L for line chart
    const monthlyPL = useMemo(() => {
        const months: Record<string, number> = {};
        closedTrades.forEach(t => {
            const month = t.sellDate.substring(0, 7);
            const pl = calculatePL(t);
            months[month] = (months[month] || 0) + pl;
        });
        return Object.entries(months)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, pl]) => ({ month, pl: Math.round(pl * 100) / 100 }));
    }, [closedTrades]);

    // Scorecard
    const scorecard = useMemo(() => {
        const journaledTrades = closedTrades.filter(t => t.lessons && t.lessons.length > 10);
        const slAdherence = closedTrades.filter(t => t.stopLoss > 0).length / Math.max(closedTrades.length, 1) * 100;
        const journalRate = journaledTrades.length / Math.max(closedTrades.length, 1) * 100;
        const calmEntries = closedTrades.filter(t => ['calm', 'confident', 'neutral'].includes(t.emotionEntry)).length;
        const emotionalControl = calmEntries / Math.max(closedTrades.length, 1) * 100;
        const overall = (metrics.winRate * 0.3 + slAdherence * 0.25 + journalRate * 0.2 + emotionalControl * 0.25);
        return { winRate: metrics.winRate, slAdherence, journalRate, emotionalControl, overall };
    }, [closedTrades, metrics]);

    const pieColors = ['#3b82f6', '#14b8a6', '#f59e0b', '#a78bfa'];

    return (
        <div className="dashboard">
            <style jsx>{`
        .dashboard { animation: fadeIn 0.4s ease; }
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
        }
        .page-top p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .period-tabs {
          display: flex;
          gap: 4px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 3px;
        }
        .period-tab {
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-tertiary);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
          background: none;
        }
        .period-tab:hover { color: var(--text-primary); }
        .period-tab.active {
          background: var(--accent-primary);
          color: white;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: all var(--transition-normal);
        }
        .kpi-card:hover {
          border-color: var(--border-primary);
          box-shadow: var(--shadow-md);
        }
        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .kpi-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .kpi-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kpi-value {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .kpi-sub {
          font-size: 12px;
          color: var(--text-tertiary);
          margin-top: 4px;
        }

        /* Charts Row */
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .chart-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .chart-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chart-title svg { color: var(--accent-primary); }

        /* Trade Cards */
        .trade-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .highlight-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .highlight-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .highlight-ticker {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .highlight-detail {
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* Scorecard */
        .scorecard {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .score-items {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-top: 20px;
        }
        .score-item {
          text-align: center;
        }
        .score-ring {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          font-size: 18px;
          font-weight: 800;
          border: 3px solid;
        }
        .score-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        @media (max-width: 1200px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .charts-row { grid-template-columns: 1fr; }
          .score-items { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .kpi-grid { grid-template-columns: 1fr; }
          .trade-cards-row { grid-template-columns: 1fr; }
          .score-items { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

            {/* Page Header */}
            <div className="page-top">
                <div>
                    <h1>Dashboard</h1>
                    <p>Your trading performance at a glance</p>
                </div>
                <div className="period-tabs">
                    {(['daily', 'weekly', 'monthly', 'yearly', 'all'] as Period[]).map(p => (
                        <button key={p} className={`period-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Realized P/L</span>
                        <div className="kpi-icon" style={{ background: metrics.realizedPL >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)', color: metrics.realizedPL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {metrics.realizedPL >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                    </div>
                    <div className="kpi-value" style={{ color: metrics.realizedPL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatPL(metrics.realizedPL)}
                    </div>
                    <div className="kpi-sub">{metrics.totalTrades} closed trades</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Unrealized P/L</span>
                        <div className="kpi-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                            <Activity size={18} />
                        </div>
                    </div>
                    <div className="kpi-value" style={{ color: metrics.unrealizedPL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatPL(metrics.unrealizedPL)}
                    </div>
                    <div className="kpi-sub">{openTrades.length} open positions</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Win Rate</span>
                        <div className="kpi-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)' }}>
                            <Target size={18} />
                        </div>
                    </div>
                    <div className="kpi-value">{metrics.winRate.toFixed(1)}%</div>
                    <div className="kpi-sub">{metrics.winCount}W / {metrics.lossCount}L</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Total Fees</span>
                        <div className="kpi-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                            <DollarSign size={18} />
                        </div>
                    </div>
                    <div className="kpi-value">{formatCurrency(metrics.totalFees)}</div>
                    <div className="kpi-sub">Across all trades</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Average Win</span>
                        <div className="kpi-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                            <TrendingUp size={18} />
                        </div>
                    </div>
                    <div className="kpi-value pl-positive">+{formatCurrency(metrics.avgWin)}</div>
                    <div className="kpi-sub">Per winning trade</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Average Loss</span>
                        <div className="kpi-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                            <TrendingDown size={18} />
                        </div>
                    </div>
                    <div className="kpi-value pl-negative">-{formatCurrency(metrics.avgLoss)}</div>
                    <div className="kpi-sub">Per losing trade</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Best Trade</span>
                        <div className="kpi-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                            <Award size={18} />
                        </div>
                    </div>
                    <div className="kpi-value pl-positive" style={{ fontSize: 20 }}>
                        {metrics.bestTrade ? `${metrics.bestTrade.ticker}` : '—'}
                    </div>
                    <div className="kpi-sub">{metrics.bestTrade ? formatPL(calculatePL(metrics.bestTrade)) : 'No trades yet'}</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">Worst Trade</span>
                        <div className="kpi-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                            <AlertTriangle size={18} />
                        </div>
                    </div>
                    <div className="kpi-value pl-negative" style={{ fontSize: 20 }}>
                        {metrics.worstTrade ? `${metrics.worstTrade.ticker}` : '—'}
                    </div>
                    <div className="kpi-sub">{metrics.worstTrade ? formatPL(calculatePL(metrics.worstTrade)) : 'No trades yet'}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-row">
                <div className="chart-card">
                    <div className="chart-title"><BarChart3 size={18} /> Profit by Market</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={marketData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,117,0.15)" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid rgba(71,85,117,0.3)', borderRadius: 8, color: '#f1f5f9', fontSize: 13 }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {marketData.map((entry, i) => (
                                    <Cell key={i} fill={entry.value >= 0 ? '#22c55e' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="chart-title"><PieChart size={18} /> Profit by Strategy</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <RPieChart>
                            <Pie data={strategyData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none" label={({ name, value }) => `${name}: ${value >= 0 ? '+' : ''}${value}`}>
                                {strategyData.map((_, i) => (
                                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid rgba(71,85,117,0.3)', borderRadius: 8, color: '#f1f5f9', fontSize: 13 }} />
                        </RPieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly P/L Chart */}
            <div className="chart-card" style={{ marginBottom: 24 }}>
                <div className="chart-title"><Activity size={18} /> Monthly Performance</div>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyPL}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,117,0.15)" />
                        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid rgba(71,85,117,0.3)', borderRadius: 8, color: '#f1f5f9', fontSize: 13 }} />
                        <Bar dataKey="pl" radius={[6, 6, 0, 0]}>
                            {monthlyPL.map((entry, i) => (
                                <Cell key={i} fill={entry.pl >= 0 ? '#22c55e' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Performance Scorecard */}
            <div className="scorecard">
                <div className="chart-title"><Zap size={18} /> Performance Scorecard</div>
                <div className="score-items">
                    {[
                        { label: 'Win Rate', value: scorecard.winRate },
                        { label: 'Stop Loss Use', value: scorecard.slAdherence },
                        { label: 'Journaling', value: scorecard.journalRate },
                        { label: 'Emotional Control', value: scorecard.emotionalControl },
                        { label: 'Overall Score', value: scorecard.overall },
                    ].map((item, i) => {
                        const color = item.value >= 70 ? 'var(--success)' : item.value >= 40 ? 'var(--warning)' : 'var(--danger)';
                        return (
                            <div key={i} className="score-item">
                                <div className="score-ring" style={{ borderColor: color, color }}>
                                    {Math.round(item.value)}
                                </div>
                                <div className="score-label">{item.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
