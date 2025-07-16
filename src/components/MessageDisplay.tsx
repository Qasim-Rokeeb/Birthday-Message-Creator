"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PartyPopper, Gift, Sparkle, Heart, Cake, Sun } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type BirthdayData = {
  recipientName: string;
  senderName: string;
  message: string;
  imageDataUrl?: string;
  template: 'classic' | 'modern' | 'playful' | 'vibrant' | 'cozy' | 'minimalist';
  birthday: string;
};

const templates = {
  classic: {
    bg: "bg-gradient-to-br from-gray-50 via-stone-50 to-gray-100",
    card: "bg-white/80 backdrop-blur-lg rounded-3xl border-primary/20 shadow-xl",
    title: "font-headline text-primary",
    prose: "prose-2xl font-body text-foreground/80",
    footer: "text-muted-foreground italic",
    icon: Gift,
  },
  modern: {
    bg: "bg-gradient-to-br from-slate-900 via-black to-slate-800",
    card: "bg-slate-800/60 backdrop-blur-2xl rounded-xl border border-slate-700 shadow-2xl shadow-blue-500/10",
    title: "font-sans font-bold text-white tracking-tight",
    prose: "prose-xl font-sans text-slate-300",
    footer: "text-slate-400",
    icon: Cake,
  },
  playful: {
    bg: "bg-gradient-to-br from-purple-200 via-rose-200 to-amber-200",
    card: "bg-white/80 backdrop-blur-md rounded-2xl border-white transform -rotate-2 shadow-2xl transition-transform duration-500 hover:rotate-0",
    title: "font-headline text-pink-500",
    prose: "prose-2xl font-body text-gray-700",
    footer: "text-gray-500 font-bold",
    icon: PartyPopper,
  },
  vibrant: {
    bg: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-red-500 to-fuchsia-500",
    card: "bg-gray-900/80 backdrop-blur-lg rounded-3xl border-white/20 shadow-2xl",
    title: "font-headline text-white",
    prose: "prose-2xl font-body text-gray-200",
    footer: "text-gray-300 font-bold",
    icon: Sun,
  },
  cozy: {
    bg: "bg-gradient-to-br from-emerald-100 via-cyan-100 to-sky-200",
    card: "bg-white/90 backdrop-blur-sm rounded-2xl border-green-200/50 shadow-lg",
    title: "font-headline text-green-800",
    prose: "prose-2xl font-body text-gray-600",
    footer: "text-green-700/90 italic",
    icon: Heart,
  },
  minimalist: {
    bg: "bg-gradient-to-br from-slate-50 to-white",
    card: "bg-white/50 backdrop-blur-sm rounded-lg border-gray-200/80 shadow-md",
    title: "font-sans font-semibold text-gray-800",
    prose: "prose-xl font-sans text-gray-500",
    footer: "text-gray-400",
    icon: Sparkle,
  }
};

const Sparkles = () => {
  const sparkleData = [
    { top: '5%', left: '10%', size: 'w-6 h-6', delay: '0s', duration: '1.5s' },
    { top: '15%', left: '85%', size: 'w-4 h-4', delay: '0.2s', duration: '1.7s' },
    { top: '80%', left: '5%', size: 'w-5 h-5', delay: '0.4s', duration: '1.6s' },
    { top: '60%', left: '95%', size: 'w-7 h-7', delay: '0.6s', duration: '1.4s' },
    { top: '35%', left: '15%', size: 'w-3 h-3', delay: '0.8s', duration: '1.8s' },
    { top: '90%', left: '70%', size: 'w-5 h-5', delay: '1s', duration: '1.5s' },
    { top: '50%', left: '50%', size: 'w-8 h-8', delay: '0.5s', duration: '1.3s' },
  ];

  return (
    <>
      {sparkleData.map((s, i) => (
        <Sparkle
          key={i}
          className={`absolute ${s.size} text-accent animate-pulse opacity-80`}
          style={{ 
            top: s.top, 
            left: s.left, 
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </>
  );
};

function MessageContent({ id }: { id: string }) {
  const [data, setData] = useState<BirthdayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      console.log("Looking for data with ID:", id);
      
      try {
        const storedData = sessionStorage.getItem(`birthday_data_${id}`);
        console.log("Raw stored data:", storedData);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("Parsed data:", parsedData);
          console.log("Image data URL exists:", !!parsedData.imageDataUrl);
          console.log("Image data URL (first 100 chars):", parsedData.imageDataUrl?.substring(0, 100));
          
          // Ensure template exists, default to 'classic' if not
          const finalData = {
            ...parsedData,
            template: parsedData.template || 'classic'
          };
          
          setData(finalData);
        } else {
          console.error("No message data found in session storage for ID:", id);
          console.log("Available sessionStorage keys:", Object.keys(sessionStorage));
          setError("Message not found. The link may have expired or is invalid.");
        }
      } catch (error) {
        console.error("Failed to parse message data:", error);
        setError("Failed to load message data.");
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="w-full max-w-2xl text-center shadow-2xl p-8 rounded-2xl">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-10 w-1/2 mx-auto mt-6" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="w-full max-w-2xl text-center shadow-2xl p-8 rounded-2xl">
          <CardContent>
            <div className="text-center space-y-4">
              <Gift className="w-16 h-16 mx-auto text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-600">Message Not Found</h2>
              <p className="text-gray-500">{error}</p>
              <Link href="/" passHref>
                <Button className="mt-4">Create New Message</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="w-full max-w-2xl text-center shadow-2xl p-8 rounded-2xl">
          <CardContent>
            <div className="text-center space-y-4">
              <Gift className="w-16 h-16 mx-auto text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-600">No Message Data</h2>
              <p className="text-gray-500">Unable to load the birthday message.</p>
              <Link href="/" passHref>
                <Button className="mt-4">Create New Message</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const theme = templates[data.template] || templates.classic;
  const Icon = theme.icon;

  return (
    <div className={cn("relative flex items-center justify-center min-h-screen overflow-hidden p-4 animate-fade-in", theme.bg)}>
      {data.template === 'classic' && <Sparkles />}
      <Card className={cn(
        "w-full max-w-2xl text-center p-4 md:p-8 transform transition-all duration-500 z-10",
        theme.card,
        data.template === 'playful' ? '' : 'hover:scale-[1.02]'
      )}>
        <CardHeader>
          <div className="flex justify-center items-center gap-4">
            <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <CardTitle className={cn("text-4xl md:text-6xl", theme.title)}>
              Happy Birthday, {data.recipientName}!
            </CardTitle>
            <PartyPopper className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="mt-4 space-y-8">
          {data.imageDataUrl && (
            <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <Image
                src={data.imageDataUrl}
                alt={`Birthday surprise for ${data.recipientName}`}
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-xl"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className={cn("prose mx-auto p-6 rounded-xl", theme.prose)}>
            <p className="whitespace-pre-wrap">{data.message}</p>
          </div>
        </CardContent>
        <CardFooter className="mt-8 justify-between items-center">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-xs text-muted-foreground hover:bg-black/10">
              Create Yours
            </Button>
          </Link>
          <p className={cn("font-body text-xl", theme.footer)}>
            With love, from {data.senderName}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export function MessageDisplay({ id }: { id: string }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-xl font-body text-primary">
        Unwrapping your message...
      </div>
    }>
      <MessageContent id={id} />
    </Suspense>
  );
}