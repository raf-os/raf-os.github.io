import type { Metadata } from "next";
import { geistSans, geistMono } from "@lib/fonts";
import "./styles/globals.css";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";

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
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
