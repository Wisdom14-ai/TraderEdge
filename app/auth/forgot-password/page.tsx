'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
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
          line-height: 1.6;
        }
        .auth-form { display: flex; flex-direction: column; gap: 18px; }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 14px;
          margin-top: 20px;
          text-align: center;
          justify-content: center;
        }
        .back-link:hover { color: var(--accent-primary); }
        .success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--success);
        }
      `}</style>

            <div className="auth-card animate-fade-in">
                <div className="auth-logo">
                    <Link href="/">Trade<span>Edge</span></Link>
                </div>

                {!sent ? (
                    <>
                        <h1 className="auth-title">Reset Password</h1>
                        <p className="auth-subtitle">Enter your email address and we&apos;ll send you a link to reset your password.</p>
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                Send Reset Link <ArrowRight size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div className="success-icon"><Mail size={28} /></div>
                        <h1 className="auth-title">Check Your Email</h1>
                        <p className="auth-subtitle">
                            We&apos;ve sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Check your inbox and follow the instructions.
                        </p>
                        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setSent(false)}>
                            Didn&apos;t receive it? Try again
                        </button>
                    </div>
                )}

                <Link href="/auth/login" className="back-link" style={{ display: 'flex' }}>
                    <ArrowLeft size={16} /> Back to login
                </Link>
            </div>
        </div>
    );
}
