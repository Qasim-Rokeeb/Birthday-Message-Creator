import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Birthday Wish Creator',
  description: 'Create and share personalized birthday messages.',
  openGraph: {
    title: 'Birthday Message Creator',
    description: 'Create and share personalized birthday messages with ease.',
    url: 'https://birthday-message-creator.vercel.app/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
  },
    twitter: {
    title: 'Birthday Message Creator',
    description: 'Create and share personalized birthday messages with ease.',
    images: [
      {
        url: '/og-image.png',
        alt: 'Birthday Message Creator',
      },
    ],
  },
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
