'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trade, User, CapitalTransaction } from './types';
import { mockTrades, mockUser, mockCapitalTransactions } from './mock-data';

interface TradeContextType {
    trades: Trade[];
    addTrade: (trade: Trade) => void;
    updateTrade: (id: string, updates: Partial<Trade>) => void;
    deleteTrade: (id: string) => void;
}

interface UserContextType {
    user: User;
    updateUser: (updates: Partial<User>) => void;
    isPro: boolean;
    isTrialActive: boolean;
}

interface CapitalContextType {
    transactions: CapitalTransaction[];
    addTransaction: (tx: CapitalTransaction) => void;
    deleteTransaction: (id: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);
const CapitalContext = createContext<CapitalContextType | undefined>(undefined);

export function TradeProvider({ children }: { children: ReactNode }) {
    const [trades, setTrades] = useState<Trade[]>(mockTrades);

    const addTrade = (trade: Trade) => {
        setTrades(prev => [trade, ...prev]);
    };

    const updateTrade = (id: string, updates: Partial<Trade>) => {
        setTrades(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTrade = (id: string) => {
        setTrades(prev => prev.filter(t => t.id !== id));
    };

    return (
        <TradeContext.Provider value={{ trades, addTrade, updateTrade, deleteTrade }}>
            {children}
        </TradeContext.Provider>
    );
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(mockUser);

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const isPro = user.plan === 'pro';
    const isTrialActive = user.plan === 'trial' && new Date(user.trialEnd) > new Date();

    return (
        <UserContext.Provider value={{ user, updateUser, isPro, isTrialActive }}>
            {children}
        </UserContext.Provider>
    );
}

export function CapitalProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<CapitalTransaction[]>(mockCapitalTransactions);

    const addTransaction = (tx: CapitalTransaction) => {
        setTransactions(prev => [tx, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    return (
        <CapitalContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
            {children}
        </CapitalContext.Provider>
    );
}

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <TradeProvider>
                <CapitalProvider>
                    {children}
                </CapitalProvider>
            </TradeProvider>
        </UserProvider>
    );
}

export function useTrades() {
    const context = useContext(TradeContext);
    if (!context) throw new Error('useTrades must be used within TradeProvider');
    return context;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
}

export function useCapital() {
    const context = useContext(CapitalContext);
    if (!context) throw new Error('useCapital must be used within CapitalProvider');
    return context;
}
