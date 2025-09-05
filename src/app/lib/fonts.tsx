import { Geist, Geist_Mono, Jersey_10, Red_Hat_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const jersey10 = Jersey_10({
  weight: '400',
  subsets: ["latin"],
});

export const redHatMono = Red_Hat_Mono({
    subsets: ["latin"],
});