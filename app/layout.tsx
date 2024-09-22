import type { Metadata } from "next";
import "./globals.css";
import '../lib/db'
 

export const metadata: Metadata = {
  title: "Av chat service",
  description: "one chat for all",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
