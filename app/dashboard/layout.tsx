'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, History, Briefcase, FileText,
  Settings, LogOut, ChevronLeft, ChevronRight, TrendingUp,
  Menu, X, Bell, User, Wallet
} from 'lucide-react';
import { AppProvider } from '@/lib/context';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Add Trade', href: '/dashboard/add-trade', icon: <PlusCircle size={20} /> },
  { label: 'Trade History', href: '/dashboard/history', icon: <History size={20} /> },
  { label: 'Open Positions', href: '/dashboard/positions', icon: <Briefcase size={20} /> },
  { label: 'Capital', href: '/dashboard/capital', icon: <Wallet size={20} /> },
  { label: 'Paper Trading', href: '/dashboard/paper', icon: <FileText size={20} /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AppProvider>
      <div className="app-shell">
        <style jsx>{`
          .app-shell {
            display: flex;
            min-height: 100vh;
            background: var(--bg-primary);
          }

          /* ─── Sidebar ─── */
          .sidebar {
            width: ${collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'};
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-subtle);
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 50;
            transition: width var(--transition-normal);
            overflow: hidden;
          }
          .sidebar-header {
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: ${collapsed ? 'center' : 'space-between'};
            border-bottom: 1px solid var(--border-subtle);
            min-height: var(--header-height);
          }
          .sidebar-logo {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.03em;
            white-space: nowrap;
            overflow: hidden;
          }
          .sidebar-logo span { color: var(--accent-primary); }
          .collapse-btn {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            color: var(--text-tertiary);
            transition: all var(--transition-fast);
            flex-shrink: 0;
          }
          .collapse-btn:hover {
            background: var(--bg-elevated);
            color: var(--text-primary);
          }
          .sidebar-nav {
            flex: 1;
            padding: 12px 10px;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 500;
            transition: all var(--transition-fast);
            white-space: nowrap;
            overflow: hidden;
            text-decoration: none;
          }
          .nav-item:hover {
            background: var(--bg-elevated);
            color: var(--text-primary);
          }
          .nav-item.active {
            background: var(--accent-glow);
            color: var(--accent-primary);
          }
          .nav-item svg { flex-shrink: 0; }
          .sidebar-footer {
            padding: 16px;
            border-top: 1px solid var(--border-subtle);
          }
          .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            border-radius: var(--radius-md);
            overflow: hidden;
          }
          .user-avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-teal));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
          }
          .user-details {
            overflow: hidden;
            white-space: nowrap;
          }
          .user-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
          }
          .user-plan {
            font-size: 11px;
            color: var(--accent-primary);
            font-weight: 600;
          }

          /* ─── Main Content ─── */
          .main-area {
            flex: 1;
            margin-left: ${collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'};
            transition: margin-left var(--transition-normal);
          }
          .top-header {
            height: var(--header-height);
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-subtle);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            position: sticky;
            top: 0;
            z-index: 40;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .mobile-menu-btn {
            display: none;
            color: var(--text-primary);
            background: none;
            border: none;
            cursor: pointer;
          }
          .header-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .header-icon-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-md);
            color: var(--text-tertiary);
            transition: all var(--transition-fast);
          }
          .header-icon-btn:hover {
            background: var(--bg-elevated);
            color: var(--text-primary);
          }
          .main-content {
            padding: 28px;
            max-width: 1400px;
          }

          /* ─── Mobile ─── */
          .mobile-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 45;
          }

          @media (max-width: 1024px) {
            .sidebar {
              transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
              width: var(--sidebar-width);
              z-index: 50;
            }
            .main-area {
              margin-left: 0;
            }
            .mobile-menu-btn { display: flex; }
            .collapse-btn { display: none; }
            .mobile-overlay {
              display: ${mobileOpen ? 'block' : 'none'};
            }
          }
        `}</style>

        {/* Mobile Overlay */}
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            {!collapsed && <span className="sidebar-logo">Trade<span>Edge</span></span>}
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                {!collapsed && item.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">AR</div>
              {!collapsed && (
                <div className="user-details">
                  <div className="user-name">Ahmad Rizal</div>
                  <div className="user-plan">Edge Pro</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main-area">
          <header className="top-header">
            <div className="header-left">
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
                {new Date().toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="header-right">
              <button className="header-icon-btn"><Bell size={18} /></button>
              <Link href="/dashboard/settings" className="header-icon-btn"><User size={18} /></Link>
            </div>
          </header>
          <main className="main-content">
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
