'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/context';
import {
    Settings, Crown, Check, Lock, Zap, Brain, Target,
    BarChart3, Shield, Star, ArrowRight, User, Mail, Calendar
} from 'lucide-react';

const STARTER_FEATURES = [
    'Manual trade logging',
    'Bursa + US + Paper trading',
    'Realized & unrealized P/L',
    'Daily/weekly/monthly/yearly views',
    'Win rate & avg gain/loss',
    'Fees tracking',
    'Open positions tracking',
    'Journaling notes',
    'Performance scorecard',
];

const PRO_FEATURES = [
    'Everything in Starter',
    'Profit by setup/source/strategy',
    'Risk analysis tools',
    'Emotional discipline tracking',
    'AI trade review',
    'AI mistake pattern detection',
    'AI monthly performance summary',
    'AI discipline scoring',
    'Advanced scorecard',
    'Premium reports & export',
];

const AI_FEATURES = [
    {
        icon: <Brain size={20} />,
        title: 'AI Trade Review',
        desc: 'Every closed trade analyzed for plan adherence, fear/greed detection, and entry/exit logic quality.',
    },
    {
        icon: <Target size={20} />,
        title: 'AI Pattern Detection',
        desc: 'Identifies your repeated mistakes, strongest setups, weakest setups, and behavioral patterns.',
    },
    {
        icon: <BarChart3 size={20} />,
        title: 'AI Monthly Coach',
        desc: 'End-of-month summary with highlights, mistakes, best conditions, and actionable recommendations.',
    },
    {
        icon: <Shield size={20} />,
        title: 'AI Discipline Score',
        desc: 'Scored on stop-loss adherence, risk-reward quality, journaling consistency, emotional control.',
    },
];

export default function SettingsPage() {
    const { user, isPro, isTrialActive } = useUser();

    return (
        <div className="settings-page">
            <style jsx>{`
        .settings-page { animation: fadeIn 0.4s ease; max-width: 900px; }
        .page-top {
          margin-bottom: 28px;
        }
        .page-top h1 { font-size: 24px; font-weight: 700; }
        .page-top p { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }

        .section {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .profile-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .info-value {
          font-size: 15px;
          font-weight: 600;
        }

        .current-plan {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }
        .plan-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .plan-info h3 { font-size: 16px; font-weight: 700; }
        .plan-info p { font-size: 13px; color: var(--text-secondary); }

        .plans-compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .plan-card {
          background: var(--bg-secondary);
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          position: relative;
        }
        .plan-card.active {
          border-color: var(--accent-primary);
        }
        .plan-card.pro {
          border-color: #a78bfa;
        }
        .plan-active-badge {
          position: absolute;
          top: -10px;
          right: 16px;
          background: var(--accent-primary);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }
        .plan-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .plan-price {
          font-size: 32px;
          font-weight: 800;
          margin: 12px 0;
        }
        .plan-price span {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-tertiary);
        }
        .plan-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 16px 0 20px;
        }
        .plan-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .plan-feature svg { flex-shrink: 0; }

        .ai-preview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ai-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
          position: relative;
        }
        .ai-card-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15));
          color: #a78bfa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .ai-card h4 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .ai-card p {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .ai-lock {
          position: absolute;
          top: 12px;
          right: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .profile-info { grid-template-columns: 1fr; }
          .plans-compare { grid-template-columns: 1fr; }
          .ai-preview { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="page-top">
                <h1>Settings & Subscription</h1>
                <p>Manage your account and subscription plan</p>
            </div>

            {/* Profile */}
            <div className="section">
                <div className="section-title"><User size={18} style={{ color: 'var(--accent-primary)' }} /> Profile</div>
                <div className="profile-info">
                    <div className="info-item">
                        <span className="info-label">Name</span>
                        <span className="info-value">{user.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{user.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Member Since</span>
                        <span className="info-value">{new Date(user.createdAt).toLocaleDateString('en-MY')}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Trial Ends</span>
                        <span className="info-value">{new Date(user.trialEnd).toLocaleDateString('en-MY')}</span>
                    </div>
                </div>
            </div>

            {/* Current Plan */}
            <div className="section">
                <div className="section-title"><Crown size={18} style={{ color: '#f59e0b' }} /> Subscription</div>
                <div className="current-plan">
                    <div className="plan-icon" style={{ background: isPro ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))' : 'var(--accent-glow)', color: isPro ? '#a78bfa' : 'var(--accent-primary)' }}>
                        {isPro ? <Crown size={24} /> : <Zap size={24} />}
                    </div>
                    <div className="plan-info">
                        <h3>{isPro ? 'Edge Pro' : 'Edge Starter'}</h3>
                        <p>{isPro ? 'Full access to all features including AI insights' : 'Core trading journal and analytics'}</p>
                    </div>
                    <span className="badge badge-pro" style={{ marginLeft: 'auto' }}>{user.plan.toUpperCase()}</span>
                </div>

                <div className="plans-compare">
                    <div className={`plan-card ${!isPro ? 'active' : ''}`}>
                        {!isPro && <div className="plan-active-badge">CURRENT</div>}
                        <h3>Edge Starter</h3>
                        <div className="plan-price">RM20<span>/month</span></div>
                        <div className="plan-features">
                            {STARTER_FEATURES.map((f, i) => (
                                <div key={i} className="plan-feature">
                                    <Check size={14} style={{ color: 'var(--success)' }} /> {f}
                                </div>
                            ))}
                        </div>
                        {isPro && <button className="btn btn-secondary" style={{ width: '100%' }}>Downgrade</button>}
                    </div>
                    <div className={`plan-card pro ${isPro ? 'active' : ''}`}>
                        {isPro && <div className="plan-active-badge" style={{ background: '#a78bfa' }}>CURRENT</div>}
                        <h3>Edge Pro</h3>
                        <div className="plan-price">RM70<span>/month</span></div>
                        <div className="plan-features">
                            {PRO_FEATURES.map((f, i) => (
                                <div key={i} className="plan-feature">
                                    <Check size={14} style={{ color: '#a78bfa' }} /> {f}
                                </div>
                            ))}
                        </div>
                        {!isPro && <button className="btn btn-primary" style={{ width: '100%' }}>Upgrade to Pro <ArrowRight size={16} /></button>}
                    </div>
                </div>
            </div>

            {/* AI Features Preview */}
            <div className="section">
                <div className="section-title"><Brain size={18} style={{ color: '#a78bfa' }} /> AI Features {!isPro && <span className="badge badge-pro">PRO</span>}</div>
                <div className="ai-preview">
                    {AI_FEATURES.map((feat, i) => (
                        <div key={i} className="ai-card">
                            {!isPro && <Lock size={16} className="ai-lock" />}
                            <div className="ai-card-icon">{feat.icon}</div>
                            <h4>{feat.title}</h4>
                            <p>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <div className="section" style={{ textAlign: 'center' }}>
                <Link href="/" className="btn btn-danger">Log Out</Link>
            </div>
        </div>
    );
}
