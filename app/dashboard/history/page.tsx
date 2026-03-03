'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowUpDown, ChevronRight, Plus } from 'lucide-react';
import { useTrades } from '@/lib/context';
import { calculatePL, formatCurrency, formatPL, formatDate } from '@/lib/utils';
import { Market, Strategy, TradeStatus } from '@/lib/types';

type SortKey = 'ticker' | 'market' | 'strategy' | 'status' | 'buyDate' | 'pl';
type SortDir = 'asc' | 'desc';

export default function HistoryPage() {
    const { trades } = useTrades();
    const [search, setSearch] = useState('');
    const [marketFilter, setMarketFilter] = useState<Market | 'all'>('all');
    const [strategyFilter, setStrategyFilter] = useState<Strategy | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<TradeStatus | 'all'>('all');
    const [sortKey, setSortKey] = useState<SortKey>('buyDate');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const realTrades = trades.filter(t => t.market !== 'paper');

    const filteredTrades = useMemo(() => {
        let result = [...realTrades];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(t => t.ticker.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
        }
        if (marketFilter !== 'all') result = result.filter(t => t.market === marketFilter);
        if (strategyFilter !== 'all') result = result.filter(t => t.strategy === strategyFilter);
        if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);

        result.sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case 'ticker': cmp = a.ticker.localeCompare(b.ticker); break;
                case 'market': cmp = a.market.localeCompare(b.market); break;
                case 'strategy': cmp = a.strategy.localeCompare(b.strategy); break;
                case 'status': cmp = a.status.localeCompare(b.status); break;
                case 'buyDate': cmp = a.buyDate.localeCompare(b.buyDate); break;
                case 'pl': cmp = calculatePL(a) - calculatePL(b); break;
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [realTrades, search, marketFilter, strategyFilter, statusFilter, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    return (
        <div className="history-page">
            <style jsx>{`
        .history-page { animation: fadeIn 0.4s ease; }
        .page-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .page-top h1 { font-size: 24px; font-weight: 700; }
        .page-top p { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }
        .filters-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 320px;
        }
        .search-box input {
          padding-left: 38px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .filter-select {
          min-width: 130px;
        }
        .sort-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          user-select: none;
          color: inherit;
          background: none;
          border: none;
          font-size: inherit;
          font-weight: inherit;
          text-transform: inherit;
          letter-spacing: inherit;
        }
        .sort-btn:hover { color: var(--accent-primary); }
        .trade-count {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 12px;
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
      `}</style>

            <div className="page-top">
                <div>
                    <h1>Trade History</h1>
                    <p>View and filter all your past trades</p>
                </div>
                <Link href="/dashboard/add-trade" className="btn btn-primary">
                    <Plus size={16} /> Add Trade
                </Link>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input className="input" placeholder="Search by ticker or tag..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="input filter-select" value={marketFilter} onChange={e => setMarketFilter(e.target.value as Market | 'all')}>
                    <option value="all">All Markets</option>
                    <option value="bursa">Bursa</option>
                    <option value="us">US</option>
                </select>
                <select className="input filter-select" value={strategyFilter} onChange={e => setStrategyFilter(e.target.value as Strategy | 'all')}>
                    <option value="all">All Strategies</option>
                    <option value="swing">Swing</option>
                    <option value="intraday">Intraday</option>
                </select>
                <select className="input filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value as TradeStatus | 'all')}>
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="trade-count">{filteredTrades.length} trade{filteredTrades.length !== 1 ? 's' : ''} found</div>

            {filteredTrades.length === 0 ? (
                <div className="empty-state">
                    <h3>No trades found</h3>
                    <p>Try adjusting your filters or add a new trade.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th><button className="sort-btn" onClick={() => toggleSort('ticker')}>Ticker <ArrowUpDown size={12} /></button></th>
                                <th><button className="sort-btn" onClick={() => toggleSort('market')}>Market <ArrowUpDown size={12} /></button></th>
                                <th><button className="sort-btn" onClick={() => toggleSort('strategy')}>Strategy <ArrowUpDown size={12} /></button></th>
                                <th><button className="sort-btn" onClick={() => toggleSort('status')}>Status <ArrowUpDown size={12} /></button></th>
                                <th><button className="sort-btn" onClick={() => toggleSort('buyDate')}>Date <ArrowUpDown size={12} /></button></th>
                                <th>Buy Price</th>
                                <th>Sell Price</th>
                                <th><button className="sort-btn" onClick={() => toggleSort('pl')}>P/L <ArrowUpDown size={12} /></button></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrades.map(trade => {
                                const pl = calculatePL(trade);
                                return (
                                    <tr key={trade.id} className="table-row-link" onClick={() => window.location.href = `/dashboard/trade/${trade.id}`}>
                                        <td style={{ fontWeight: 700 }}>{trade.ticker}</td>
                                        <td><span className="badge badge-neutral">{trade.market.toUpperCase()}</span></td>
                                        <td><span className="badge badge-info">{trade.strategy}</span></td>
                                        <td>
                                            <span className={`badge ${trade.status === 'open' ? 'badge-warning' : 'badge-success'}`}>
                                                {trade.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{formatDate(trade.buyDate)}</td>
                                        <td>{trade.buyPrice.toFixed(2)}</td>
                                        <td>{trade.status === 'closed' ? trade.sellPrice.toFixed(2) : '—'}</td>
                                        <td>
                                            {trade.status === 'closed' ? (
                                                <span style={{ fontWeight: 700, color: pl >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                    {formatPL(pl)}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>—</span>
                                            )}
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
