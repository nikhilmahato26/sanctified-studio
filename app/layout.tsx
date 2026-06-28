import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sanctifiedstudio.com"),
  title: {
    default: "Sanctified Studio — Wedding & Baby Shower Photography",
    template: "%s · Sanctified Studio",
  },
  description:
    "A photography studio for weddings and baby showers. Moments worth keeping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}
