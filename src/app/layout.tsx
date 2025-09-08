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
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'; // Be cautious with 'unsafe-inline'
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp.replace(/\s{2,}/g, ' ').trim()} />
      </head>
      <body
        className={`${geistSans.className} antialiased w-full min-h-dvh`}
      >
        {children}
      </body>
    </html>
  );
}
