import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const titanOne = localFont({
  src: "./fonts/TitanOne-Regular.ttf",
  variable: "--font-titan-one",
});

export const metadata: Metadata = {
  title: "Guess the film! - Cinekoo",
  description: "A movie guessing game based on a daily haiku",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${titanOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
