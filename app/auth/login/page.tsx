'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, TrendingUp } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
          max-width: 420px;
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
        .password-toggle:hover { color: var(--text-secondary); }
        .auth-links {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }
        .auth-links a { color: var(--accent-primary); }
        .auth-links a:hover { text-decoration: underline; }
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
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Log in to your trading dashboard</p>

                <form className="auth-form" onSubmit={handleSubmit}>
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="auth-links">
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <input type="checkbox" /> Remember me
                        </label>
                        <Link href="/auth/forgot-password">Forgot password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Log In <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account? <Link href="/auth/signup">Start free trial</Link>
                </div>
            </div>
        </div>
    );
}
