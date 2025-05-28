import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import NavigationWrapper from "@/components/NavigationWrapper"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Learnext",
    template: "%s | Learnext"
  },
  description: "Learnext helps students master technical skills through interactive courses, aptitude tests, and collaborative learning experiences.",
  keywords: ["online learning","learnext", "tech education", "coding", "aptitude tests", "roadmaps", "student resources","experts"],
  authors: [{ name: "Learnext Team" }],
  creator: "Learnext",
  publisher: "Learnext",
  formatDetection: {
    telephone: false,
    email: true,
    address: false,
  },
  metadataBase: new URL("https://www.learnext.live/"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.learnext.live/",
    title: "Learnext | Modern Online Learning Platform",
    description: "Learnext helps students master technical skills through interactive roadmaps, tests, and expert guidance.",
    siteName: "Learnext",
    images: [
      {
        url: "https://www.learnext.live/Learn.jpg",
        width: 1200,
        height: 630,
        alt: "Learnext - Learn, Test, Improve",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Learnext",
    statusBarStyle: "black-translucent",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavigationWrapper>{children}</NavigationWrapper>
      </body>
    </html>
  )
}