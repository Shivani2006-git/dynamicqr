import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRPay Manager - Dynamic QR Codes for Payments",
  description: "Create static QR codes with dynamic payment links. Update your UPI details anytime without reprinting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
