import type { Metadata } from "next";
import { geistSans, geistMono } from "@lib/fonts";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Github Page",
  description: "yes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased w-full min-h-dvh`}
      >
        {children}
      </body>
    </html>
  );
}
