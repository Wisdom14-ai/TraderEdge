'use client';

import React, { useState, useMemo } from 'react';
import {
    Wallet, ArrowDownToLine, ArrowUpFromLine, Plus, X, Save,
    TrendingUp, TrendingDown, Building2, DollarSign, Landmark
} from 'lucide-react';
import { useCapital } from '@/lib/context';
import { CapitalTransaction, AccountType, TransactionType } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const ACCOUNT_LABELS: Record<AccountType, string> = {
    cds: 'CDS Account',
    brokerage_bursa: 'Bursa Brokerage',
    brokerage_us: 'US Brokerage',
    paper: 'Paper Account',
};

const ACCOUNT_ICONS: Record<AccountType, React.ReactNode> = {
    cds: <Landmark size={18} />,
    brokerage_bursa: <Building2 size={18} />,
    brokerage_us: <DollarSign size={18} />,
    paper: <Wallet size={18} />,
};

export default function CapitalPage() {
    const { transactions, addTransaction } = useCapital();
    const [showForm, setShowForm] = useState(false);
    const [filterAccount, setFilterAccount] = useState<AccountType | 'all'>('all');

    const [form, setForm] = useState({
        type: 'deposit' as TransactionType,
        account: 'cds' as AccountType,
        amount: '',
        date: '',
        reference: '',
        note: '',
    });

    const sortedTx = useMemo(() => {
        let result = [...transactions];
        if (filterAccount !== 'all') result = result.filter(t => t.account === filterAccount);
        return result.sort((a, b) => b.date.localeCompare(a.date));
    }, [transactions, filterAccount]);

    // Calculate balances per account
    const balances = useMemo(() => {
        const map: Record<string, number> = {};
        for (const tx of transactions) {
            if (!map[tx.account]) map[tx.account] = 0;
            if (tx.type === 'deposit') map[tx.account] += tx.amount;
            else if (tx.type === 'withdrawal') map[tx.account] -= tx.amount;
        }
        return map;
    }, [transactions]);

    const totalDeposited = useMemo(() => transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0), [transactions]);
    const totalWithdrawn = useMemo(() => transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0), [transactions]);
    const netCapital = totalDeposited - totalWithdrawn;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tx: CapitalTransaction = {
            id: `cap${Date.now()}`,
            userId: 'u1',
            type: form.type,
            account: form.account,
            amount: parseFloat(form.amount) || 0,
            date: form.date,
            reference: form.reference,
            note: form.note,
            createdAt: new Date().toISOString(),
        };
        addTransaction(tx);
        setForm({ type: 'deposit', account: 'cds', amount: '', date: '', reference: '', note: '' });
        setShowForm(false);
    };

    return (
        <div className="capital-page">
            <style jsx>{`
        .capital-page { animation: fadeIn 0.4s ease; }
        .page-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
        }
        .page-top h1 { font-size: 24px; font-weight: 700; }
        .page-top p { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }

        /* Summary Cards */
        .summary-row {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px;
        }
        .sum-card {
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg); padding: 22px;
        }
        .sum-label {
          font-size: 12px; font-weight: 600; color: var(--text-tertiary);
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .sum-value { font-size: 28px; font-weight: 800; }

        /* Account Balances */
        .balance-section-title {
          font-size: 16px; font-weight: 700; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .balance-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px; margin-bottom: 28px;
        }
        .bal-card {
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg); padding: 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .bal-icon {
          width: 42px; height: 42px; border-radius: var(--radius-md);
          background: var(--accent-glow); color: var(--accent-primary);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .bal-name { font-size: 13px; color: var(--text-secondary); margin-bottom: 2px; }
        .bal-amount { font-size: 20px; font-weight: 800; }

        /* Add Form */
        .form-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .form-modal {
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg); padding: 28px; width: 100%; max-width: 520px;
          box-shadow: var(--shadow-xl);
        }
        .form-modal-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
        }
        .form-modal-header h2 { font-size: 18px; font-weight: 700; }
        .close-btn {
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-sm); color: var(--text-muted); transition: all var(--transition-fast);
        }
        .close-btn:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .span-full { grid-column: 1 / -1; }
        .type-toggle {
          display: flex; gap: 0; border-radius: var(--radius-md); overflow: hidden;
          border: 1px solid var(--border-subtle);
        }
        .type-btn {
          flex: 1; padding: 10px; text-align: center; font-size: 13px; font-weight: 600;
          background: var(--bg-secondary); color: var(--text-secondary);
          border: none; cursor: pointer; transition: all var(--transition-fast);
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .type-btn.active-deposit {
          background: rgba(16, 185, 129, 0.12); color: var(--success); border-color: var(--success);
        }
        .type-btn.active-withdrawal {
          background: rgba(239, 68, 68, 0.12); color: var(--danger); border-color: var(--danger);
        }

        /* Filters */
        .filter-bar {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
        }
        .tx-count { font-size: 13px; color: var(--text-tertiary); margin-bottom: 12px; }

        /* Table type badges */
        .tx-type-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600;
        }
        .tx-deposit { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .tx-withdrawal { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .tx-transfer { background: rgba(59, 130, 246, 0.1); color: var(--accent-primary); }

        @media (max-width: 1024px) {
          .summary-row { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="page-top">
                <div>
                    <h1>Capital Management</h1>
                    <p>Track deposits and withdrawals across your brokerage & CDS accounts</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={16} /> Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="summary-row">
                <div className="sum-card">
                    <div className="sum-label"><TrendingUp size={14} /> Net Capital</div>
                    <div className="sum-value" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(netCapital)}</div>
                </div>
                <div className="sum-card">
                    <div className="sum-label"><ArrowDownToLine size={14} /> Total Deposited</div>
                    <div className="sum-value" style={{ color: 'var(--success)' }}>{formatCurrency(totalDeposited)}</div>
                </div>
                <div className="sum-card">
                    <div className="sum-label"><ArrowUpFromLine size={14} /> Total Withdrawn</div>
                    <div className="sum-value" style={{ color: 'var(--danger)' }}>{formatCurrency(totalWithdrawn)}</div>
                </div>
            </div>

            {/* Account Balances */}
            <div className="balance-section-title"><Wallet size={16} style={{ color: 'var(--accent-primary)' }} /> Account Balances</div>
            <div className="balance-grid">
                {(Object.keys(ACCOUNT_LABELS) as AccountType[])
                    .filter(acc => acc !== 'paper')
                    .map(acc => (
                        <div key={acc} className="bal-card">
                            <div className="bal-icon">{ACCOUNT_ICONS[acc]}</div>
                            <div>
                                <div className="bal-name">{ACCOUNT_LABELS[acc]}</div>
                                <div className="bal-amount">{formatCurrency(balances[acc] || 0)}</div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <select className="input" style={{ minWidth: 170 }} value={filterAccount} onChange={e => setFilterAccount(e.target.value as AccountType | 'all')}>
                    <option value="all">All Accounts</option>
                    <option value="cds">CDS Account</option>
                    <option value="brokerage_bursa">Bursa Brokerage</option>
                    <option value="brokerage_us">US Brokerage</option>
                </select>
            </div>
            <div className="tx-count">{sortedTx.length} transaction{sortedTx.length !== 1 ? 's' : ''}</div>

            {/* Transaction History Table */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Account</th>
                            <th>Amount</th>
                            <th>Reference</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTx.map(tx => (
                            <tr key={tx.id}>
                                <td style={{ color: 'var(--text-secondary)' }}>{formatDate(tx.date)}</td>
                                <td>
                                    <span className={`tx-type-badge ${tx.type === 'deposit' ? 'tx-deposit' : tx.type === 'withdrawal' ? 'tx-withdrawal' : 'tx-transfer'}`}>
                                        {tx.type === 'deposit' ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                                        {tx.type}
                                    </span>
                                </td>
                                <td><span className="badge badge-neutral">{ACCOUNT_LABELS[tx.account]}</span></td>
                                <td style={{ fontWeight: 700, color: tx.type === 'deposit' ? 'var(--success)' : 'var(--danger)' }}>
                                    {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </td>
                                <td style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{tx.reference || '—'}</td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.note || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Transaction Modal */}
            {showForm && (
                <div className="form-overlay" onClick={() => setShowForm(false)}>
                    <div className="form-modal" onClick={e => e.stopPropagation()}>
                        <div className="form-modal-header">
                            <h2>Add Transaction</h2>
                            <button className="close-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {/* Type Toggle */}
                            <div className="input-group" style={{ marginBottom: 16 }}>
                                <label>Transaction Type</label>
                                <div className="type-toggle">
                                    <button type="button"
                                        className={`type-btn ${form.type === 'deposit' ? 'active-deposit' : ''}`}
                                        onClick={() => setForm(p => ({ ...p, type: 'deposit' }))}
                                    >
                                        <ArrowDownToLine size={14} /> Deposit
                                    </button>
                                    <button type="button"
                                        className={`type-btn ${form.type === 'withdrawal' ? 'active-withdrawal' : ''}`}
                                        onClick={() => setForm(p => ({ ...p, type: 'withdrawal' }))}
                                    >
                                        <ArrowUpFromLine size={14} /> Withdrawal
                                    </button>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Account *</label>
                                    <select className="input" value={form.account} onChange={e => setForm(p => ({ ...p, account: e.target.value as AccountType }))}>
                                        <option value="cds">CDS Account</option>
                                        <option value="brokerage_bursa">Bursa Brokerage</option>
                                        <option value="brokerage_us">US Brokerage</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Amount (RM) *</label>
                                    <input type="number" step="0.01" className="input" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required />
                                </div>
                                <div className="input-group">
                                    <label>Date *</label>
                                    <input type="date" className="input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                                </div>
                                <div className="input-group">
                                    <label>Reference No.</label>
                                    <input className="input" placeholder="e.g. FPX-001" value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} />
                                </div>
                                <div className="input-group span-full">
                                    <label>Note</label>
                                    <textarea className="input" rows={2} placeholder="Optional note about this transaction" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary"><Save size={16} /> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
