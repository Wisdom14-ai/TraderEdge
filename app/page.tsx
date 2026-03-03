'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    TrendingUp, BarChart3, Target, Brain, Shield, Zap,
    ChevronDown, ChevronRight, Menu, X, LineChart,
    PieChart, Activity, BookOpen, ArrowRight, Star,
    Check, Minus
} from 'lucide-react';

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
];

const PAIN_POINTS = [
    { icon: '📊', title: 'Scattered Data', desc: 'Your trades live in spreadsheets, screenshots, and memory. No single source of truth.' },
    { icon: '🎰', title: 'Emotional Decisions', desc: 'FOMO entries, revenge trades, panic exits. You know the pattern but can\'t break it.' },
    { icon: '📉', title: 'No Real Analytics', desc: 'You don\'t know your real win rate, best setups, or how much fees are eating your profits.' },
    { icon: '🔄', title: 'Repeating Mistakes', desc: 'Same errors, different day. Without tracking, you can\'t see the behavioral loops.' },
];

const FEATURES = [
    { icon: <LineChart size={24} />, title: 'Trade Logging', desc: 'Log every trade with 23+ fields — price, thesis, emotions, lessons. Build your trading history.' },
    { icon: <BarChart3 size={24} />, title: 'Performance Dashboard', desc: 'Real-time P/L, win rate, avg gain/loss, fees — daily, weekly, monthly, yearly views.' },
    { icon: <Target size={24} />, title: 'Position Tracking', desc: 'Monitor open positions, unrealized P/L, distance to targets, and risk exposure.' },
    { icon: <PieChart size={24} />, title: 'Strategy Analytics', desc: 'Profit by market, strategy, and setup. Know what actually works in your trading.' },
    { icon: <Brain size={24} />, title: 'AI Trade Review', desc: 'AI analyzes your trades for FOMO, revenge patterns, and logical consistency.' },
    { icon: <Shield size={24} />, title: 'Discipline Score', desc: 'Get scored on stop-loss adherence, journaling, emotional control, and rule-following.' },
];

const PRICING_PLANS = [
    {
        name: 'Edge Starter',
        price: 20,
        period: '/month',
        desc: 'Everything you need to start tracking like a real trader.',
        features: [
            'Manual trade logging',
            'Bursa + US + Paper trading',
            'Realized & unrealized P/L',
            'Daily/weekly/monthly/yearly views',
            'Win rate & avg gain/loss',
            'Fees tracking',
            'Open positions tracking',
            'Journaling notes',
            'Performance scorecard',
        ],
        cta: 'Start Free Trial',
        highlighted: false,
    },
    {
        name: 'Edge Pro',
        price: 70,
        period: '/month',
        desc: 'Advanced analytics and AI-powered insights to master your edge.',
        features: [
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
        ],
        cta: 'Start Free Trial',
        highlighted: true,
    },
];

const FAQS = [
    { q: 'What markets does TradeEdge support?', a: 'TradeEdge supports Bursa Malaysia and US stock markets, plus a dedicated paper trading environment for strategy testing.' },
    { q: 'Do you connect to my broker?', a: 'Not yet. TradeEdge is manual-entry first, which means you control every data point. Broker sync is on our roadmap.' },
    { q: 'Can I try before I pay?', a: 'Absolutely. Every new account gets a 14-day free trial with full Starter access. No credit card required.' },
    { q: 'What AI features are included?', a: 'Pro users get AI trade reviews, pattern detection, monthly coaching summaries, and a discipline score based on your trading behavior.' },
    { q: 'Is my data secure?', a: 'Your trading data is encrypted and stored securely. We never share your data with third parties.' },
    { q: 'Can I use it on mobile?', a: 'Yes. TradeEdge is a responsive web app — desktop-first for deep analysis, mobile-friendly for quick entries.' },
];

export default function LandingPage() {
    const [mobileNav, setMobileNav] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="landing">
            <style jsx>{`
        .landing {
          --gradient-hero: linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, transparent 60%);
        }

        /* ─── Nav ─── */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 16px 0;
          background: rgba(10, 14, 23, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .nav-logo span {
          color: var(--accent-primary);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .nav-links a:hover { color: var(--text-primary); }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-toggle {
          display: none;
          color: var(--text-primary);
          background: none;
          border: none;
          cursor: pointer;
        }
        .mobile-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-primary);
          z-index: 99;
          padding: 24px;
          flex-direction: column;
          gap: 16px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          font-size: 18px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .mobile-toggle { display: block; }
        }

        /* ─── Hero ─── */
        .hero {
          padding: 160px 0 100px;
          text-align: center;
          background: var(--gradient-hero);
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: var(--accent-glow);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-primary);
          margin-bottom: 24px;
        }
        .hero h1 {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero h1 .gradient-text {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero p {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 560px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }
        .hero-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 64px;
          padding-top: 48px;
          border-top: 1px solid var(--border-subtle);
        }
        .hero-stat {
          text-align: center;
        }
        .hero-stat .value {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .hero-stat .label {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .hero { padding: 120px 0 60px; }
          .hero h1 { font-size: 36px; }
          .hero p { font-size: 16px; }
          .hero-stats { gap: 24px; flex-wrap: wrap; }
          .hero-stat .value { font-size: 22px; }
        }

        /* ─── Pain Points ─── */
        .pain {
          padding: 100px 0;
          position: relative;
        }
        .section-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .section-title {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .section-desc {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 48px;
        }
        .pain-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .pain-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 28px;
          transition: all var(--transition-normal);
        }
        .pain-card:hover {
          border-color: var(--danger-border);
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.05);
        }
        .pain-icon {
          font-size: 28px;
          margin-bottom: 16px;
        }
        .pain-card h3 {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .pain-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .pain-grid { grid-template-columns: 1fr; }
          .section-title { font-size: 28px; }
        }

        /* ─── Features ─── */
        .features {
          padding: 100px 0;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 32px;
          transition: all var(--transition-normal);
        }
        .feature-card:hover {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-glow);
          transform: translateY(-2px);
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-glow);
          border-radius: var(--radius-md);
          color: var(--accent-primary);
          margin-bottom: 20px;
        }
        .feature-card h3 {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .feature-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
        }

        /* ─── Dashboard Preview ─── */
        .preview {
          padding: 100px 0;
        }
        .preview-container {
          text-align: center;
        }
        .preview-mock {
          margin-top: 48px;
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          padding: 32px;
          box-shadow: var(--shadow-lg), 0 0 60px rgba(59, 130, 246, 0.05);
        }
        .mock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .mock-header h3 {
          font-size: 16px;
          font-weight: 700;
        }
        .mock-kpis {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .mock-kpi {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
          text-align: left;
        }
        .mock-kpi .kpi-label {
          font-size: 12px;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .mock-kpi .kpi-value {
          font-size: 24px;
          font-weight: 800;
        }
        .mock-chart {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 24px;
          height: 200px;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          overflow: hidden;
        }
        .chart-bar {
          flex: 1;
          background: linear-gradient(to top, var(--accent-primary), rgba(59, 130, 246, 0.4));
          border-radius: 4px 4px 0 0;
          min-height: 20px;
          transition: height 0.5s ease;
        }

        @media (max-width: 768px) {
          .mock-kpis { grid-template-columns: repeat(2, 1fr); }
        }

        /* ─── Pricing ─── */
        .pricing {
          padding: 100px 0;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }
        .pricing-container {
          text-align: center;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          max-width: 800px;
          margin: 48px auto 0;
        }
        .pricing-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 36px;
          text-align: left;
          transition: all var(--transition-normal);
          position: relative;
        }
        .pricing-card.highlighted {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-glow), 0 0 60px rgba(59, 130, 246, 0.08);
        }
        .pricing-popular {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-teal));
          color: white;
          padding: 4px 16px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .pricing-name {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .pricing-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 24px;
        }
        .pricing-price .currency {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .pricing-price .amount {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .pricing-price .period {
          font-size: 14px;
          color: var(--text-tertiary);
        }
        .pricing-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }
        .pricing-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .pricing-feature .check {
          color: var(--success);
          flex-shrink: 0;
        }

        .trial-note {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: var(--text-tertiary);
        }

        @media (max-width: 640px) {
          .pricing-grid { grid-template-columns: 1fr; }
        }

        /* ─── FAQ ─── */
        .faq {
          padding: 100px 0;
        }
        .faq-container {
          max-width: 700px;
          margin: 0 auto;
        }
        .faq-list {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .faq-item {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }
        .faq-item.open {
          border-color: var(--border-primary);
        }
        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
        }
        .faq-question:hover {
          color: var(--accent-primary);
        }
        .faq-answer {
          padding: 0 24px 18px;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* ─── CTA Footer ─── */
        .cta-footer {
          padding: 100px 0;
          text-align: center;
          background: linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.04) 100%);
          position: relative;
        }
        .cta-footer::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-footer h2 {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .cta-footer p {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 32px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ─── Footer ─── */
        .footer {
          padding: 32px 0;
          border-top: 1px solid var(--border-subtle);
          text-align: center;
        }
        .footer p {
          font-size: 13px;
          color: var(--text-muted);
        }
      `}</style>

            {/* Navigation */}
            <nav className="nav">
                <div className="nav-inner">
                    <Link href="/" className="nav-logo">Trade<span>Edge</span></Link>
                    <div className="nav-links">
                        {NAV_LINKS.map(link => (
                            <a key={link.href} href={link.href}>{link.label}</a>
                        ))}
                    </div>
                    <div className="nav-actions">
                        <Link href="/auth/login" className="btn btn-ghost">Log In</Link>
                        <Link href="/auth/signup" className="btn btn-primary btn-sm">Start Free Trial</Link>
                    </div>
                    <button className="mobile-toggle" onClick={() => setMobileNav(!mobileNav)}>
                        {mobileNav ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu ${mobileNav ? 'open' : ''}`}>
                {NAV_LINKS.map(link => (
                    <a key={link.href} href={link.href} onClick={() => setMobileNav(false)}>{link.label}</a>
                ))}
                <Link href="/auth/login" onClick={() => setMobileNav(false)}>Log In</Link>
                <Link href="/auth/signup" className="btn btn-primary" onClick={() => setMobileNav(false)}>Start Free Trial</Link>
            </div>

            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <div className="hero-badge">
                        <Zap size={14} />
                        Built for Malaysian Traders
                    </div>
                    <h1>
                        Stop Guessing.<br />
                        <span className="gradient-text">Start Tracking Like a Real Trader.</span>
                    </h1>
                    <p>
                        The trading performance and decision intelligence platform that transforms reckless trading into disciplined, data-driven execution.
                    </p>
                    <div className="hero-cta">
                        <Link href="/auth/signup" className="btn btn-primary btn-lg">
                            Start 14-Day Free Trial <ArrowRight size={18} />
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">See Features</a>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="value">23+</div>
                            <div className="label">Data Points Per Trade</div>
                        </div>
                        <div className="hero-stat">
                            <div className="value">Bursa + US</div>
                            <div className="label">Multi-Market Support</div>
                        </div>
                        <div className="hero-stat">
                            <div className="value">AI-Powered</div>
                            <div className="label">Trade Analysis</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pain Points */}
            <section className="pain">
                <div className="container">
                    <div className="section-label">The Problem</div>
                    <h2 className="section-title">Sound Familiar?</h2>
                    <p className="section-desc">
                        Most Malaysian retail traders lose money not because of bad setups — but because they don&apos;t track, review, or learn from their trades.
                    </p>
                    <div className="pain-grid">
                        {PAIN_POINTS.map((point, i) => (
                            <div key={i} className="pain-card">
                                <div className="pain-icon">{point.icon}</div>
                                <h3>{point.title}</h3>
                                <p>{point.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features" id="features">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="section-label">Features</div>
                        <h2 className="section-title">Everything You Need to Trade With Edge</h2>
                        <p className="section-desc" style={{ margin: '0 auto' }}>
                            From detailed trade logging to AI-powered insights — every tool designed to make you a more disciplined, profitable trader.
                        </p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((feat, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon">{feat.icon}</div>
                                <h3>{feat.title}</h3>
                                <p>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="preview">
                <div className="container">
                    <div className="preview-container">
                        <div className="section-label">Dashboard Preview</div>
                        <h2 className="section-title">Your Trading Command Center</h2>
                        <p className="section-desc" style={{ margin: '0 auto' }}>
                            See everything that matters at a glance — performance, positions, and patterns.
                        </p>
                        <div className="preview-mock">
                            <div className="mock-header">
                                <h3>📊 Performance Overview</h3>
                                <div className="badge badge-info">Live Demo</div>
                            </div>
                            <div className="mock-kpis">
                                <div className="mock-kpi">
                                    <div className="kpi-label">Realized P/L</div>
                                    <div className="kpi-value pl-positive">+RM3,847.50</div>
                                </div>
                                <div className="mock-kpi">
                                    <div className="kpi-label">Win Rate</div>
                                    <div className="kpi-value">64.3%</div>
                                </div>
                                <div className="mock-kpi">
                                    <div className="kpi-label">Total Trades</div>
                                    <div className="kpi-value">28</div>
                                </div>
                                <div className="mock-kpi">
                                    <div className="kpi-label">Avg Win</div>
                                    <div className="kpi-value pl-positive">+RM412.80</div>
                                </div>
                            </div>
                            <div className="mock-chart">
                                {[65, 40, 80, 55, 90, 35, 70, 85, 45, 95, 60, 75, 50, 88, 42, 78, 92, 58, 83, 68].map((h, i) => (
                                    <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="pricing" id="pricing">
                <div className="container">
                    <div className="pricing-container">
                        <div className="section-label">Pricing</div>
                        <h2 className="section-title">Simple, Transparent Pricing</h2>
                        <p className="section-desc" style={{ margin: '0 auto' }}>
                            Start free. Upgrade when you&apos;re ready to unlock advanced analytics and AI.
                        </p>
                        <div className="pricing-grid">
                            {PRICING_PLANS.map((plan, i) => (
                                <div key={i} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
                                    {plan.highlighted && <div className="pricing-popular">MOST POPULAR</div>}
                                    <div className="pricing-name">{plan.name}</div>
                                    <div className="pricing-desc">{plan.desc}</div>
                                    <div className="pricing-price">
                                        <span className="currency">RM</span>
                                        <span className="amount">{plan.price}</span>
                                        <span className="period">{plan.period}</span>
                                    </div>
                                    <div className="pricing-features">
                                        {plan.features.map((feat, j) => (
                                            <div key={j} className="pricing-feature">
                                                <Check size={16} className="check" />
                                                {feat}
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/auth/signup" className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                                        {plan.cta}
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <p className="trial-note">14-day free trial on all plans. No credit card required.</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq" id="faq">
                <div className="faq-container container">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">FAQ</div>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                    </div>
                    <div className="faq-list">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    {faq.q}
                                    <ChevronDown size={18} style={{ transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
                                </button>
                                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="cta-footer">
                <div className="container">
                    <h2>Ready to Trade With Edge?</h2>
                    <p>Join traders who stopped guessing and started tracking. Your discipline transformation starts here.</p>
                    <Link href="/auth/signup" className="btn btn-primary btn-lg">
                        Start 14-Day Free Trial <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>© 2026 TradeEdge. All rights reserved. Built for Malaysian traders, by Malaysian traders.</p>
                </div>
            </footer>
        </div>
    );
}
