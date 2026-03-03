import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TradeEdge — Trading Performance & Decision Intelligence",
    description: "Stop guessing. Start tracking like a real trader. The premium trading journal and analytics platform for Malaysian retail traders.",
    keywords: ["trading journal", "Bursa Malaysia", "stock tracker", "trading analytics", "trade log", "portfolio tracker"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
