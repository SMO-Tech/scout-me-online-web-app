import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/lib/AuthContext";

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
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
