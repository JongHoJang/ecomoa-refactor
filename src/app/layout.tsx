import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Providers from "@/components/shared/providers";
import Script from "next/script";
import Footer from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "에코모아",
  description: "탄소를 절감하며 에코모아를 키워주세요",
  icons: {
    icon: "/service/favicon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <Header />
        </div>
        <div className="min-h-[835px]">
          <Script
            src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
            strategy="beforeInteractive"
          />
          <Providers>{children}</Providers>
        </div>
        <div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
