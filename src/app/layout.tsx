import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout Me Online",
  description: "Platform for soccer scouts and players",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
