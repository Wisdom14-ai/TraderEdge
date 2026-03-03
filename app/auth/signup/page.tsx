'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, Check, Star } from 'lucide-react';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plan, setPlan] = useState<'starter' | 'pro'>('starter');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = '/dashboard';
    };

    return (
        <div className="auth-page">
            <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }
        .auth-page::before {
          content: '';
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-card {
          width: 100%;
          max-width: 480px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          padding: 40px;
          position: relative;
          z-index: 1;
          box-shadow: var(--shadow-lg);
        }
        .auth-logo {
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-logo a {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .auth-logo a span { color: var(--accent-primary); }
        .auth-title {
          font-size: 22px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 4px;
        }
        .auth-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 28px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 18px; }
        .password-wrapper {
          position: relative;
        }
        .password-wrapper .input {
          padding-right: 44px;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
          display: flex;
        }
        .plan-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .plan-option {
          position: relative;
          background: var(--bg-secondary);
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }
        .plan-option:hover {
          border-color: var(--border-primary);
        }
        .plan-option.selected {
          border-color: var(--accent-primary);
          background: var(--accent-glow);
        }
        .plan-option input {
          position: absolute;
          opacity: 0;
        }
        .plan-name {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .plan-price {
          font-size: 13px;
          color: var(--text-secondary);
        }
        .plan-badge {
          position: absolute;
          top: -8px;
          right: 12px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-teal));
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          letter-spacing: 0.05em;
        }
        .trial-note {
          font-size: 12px;
          color: var(--text-tertiary);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .auth-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
          font-size: 14px;
          color: var(--text-secondary);
        }
        .auth-footer a {
          color: var(--accent-primary);
          font-weight: 600;
        }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

            <div className="auth-card animate-fade-in">
                <div className="auth-logo">
                    <Link href="/">Trade<span>Edge</span></Link>
                </div>
                <h1 className="auth-title">Start Your Free Trial</h1>
                <p className="auth-subtitle">14 days free. No credit card required.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Ahmad Rizal"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Choose Your Plan</label>
                        <div className="plan-selector">
                            <label className={`plan-option ${plan === 'starter' ? 'selected' : ''}`}>
                                <input type="radio" name="plan" checked={plan === 'starter'} onChange={() => setPlan('starter')} />
                                <div className="plan-name">Edge Starter</div>
                                <div className="plan-price">RM20/month</div>
                            </label>
                            <label className={`plan-option ${plan === 'pro' ? 'selected' : ''}`}>
                                <input type="radio" name="plan" checked={plan === 'pro'} onChange={() => setPlan('pro')} />
                                <div className="plan-badge">POPULAR</div>
                                <div className="plan-name">Edge Pro</div>
                                <div className="plan-price">RM70/month</div>
                            </label>
                        </div>
                    </div>

                    <div className="trial-note">
                        <Star size={12} /> Both plans include 14-day free trial
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link href="/auth/login">Log in</Link>
                </div>
            </div>
        </div>
    );
}
