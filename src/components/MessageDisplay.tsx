
"use client";

import { useSearchParams } from "next/navigation";
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
};

const templates = {
  classic: {
    bg: "bg-gradient-to-br from-rose-50 to-amber-50",
    card: "bg-white/80 backdrop-blur-lg rounded-3xl border-primary/20",
    title: "font-headline text-primary",
    prose: "prose-2xl font-body text-foreground/80 bg-black/5",
    footer: "text-muted-foreground italic",
    icon: Gift,
  },
  modern: {
    bg: "bg-gradient-to-br from-slate-900 to-slate-800",
    card: "bg-black/50 backdrop-blur-xl rounded-xl border-slate-700",
    title: "font-sans font-bold text-white tracking-tight",
    prose: "prose-xl font-sans text-slate-300",
    footer: "text-slate-400",
    icon: Cake,
  },
  playful: {
    bg: "bg-gradient-to-br from-violet-100 via-pink-100 to-blue-100",
    card: "bg-white/70 backdrop-blur-md rounded-2xl border-white transform -rotate-1",
    title: "font-headline text-pink-500",
    prose: "prose-2xl font-body text-gray-700",
    footer: "text-gray-500 font-bold",
    icon: PartyPopper,
  },
   vibrant: {
    bg: "bg-gradient-to-br from-yellow-200 via-orange-300 to-red-400",
    card: "bg-white/80 backdrop-blur-lg rounded-3xl border-white/50",
    title: "font-headline text-orange-600",
    prose: "prose-2xl font-body text-gray-800",
    footer: "text-orange-800/80 font-bold",
    icon: Sun,
  },
  cozy: {
    bg: "bg-gradient-to-br from-green-100 to-teal-100",
    card: "bg-white/90 backdrop-blur-sm rounded-2xl border-green-200/50 shadow-lg",
    title: "font-headline text-green-800",
    prose: "prose-2xl font-body text-gray-600",
    footer: "text-green-700/90 italic",
    icon: Heart,
  },
  minimalist: {
    bg: "bg-gray-100",
    card: "bg-white rounded-lg border-gray-200",
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

function MessageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<BirthdayData | null>(null);

  useEffect(() => {
    const encodedData = searchParams.get("data");
    if (encodedData) {
      try {
        const decodedData = atob(encodedData);
        const parsedData = JSON.parse(decodedData);
        setData(parsedData.template ? parsedData : { ...parsedData, template: 'classic' });
      } catch (error) {
        console.error("Failed to parse message data:", error);
      }
    }
  }, [searchParams]);

  if (!data) {
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

  const theme = templates[data.template] || templates.classic;
  const Icon = theme.icon;

  return (
    <div className={cn("relative flex items-center justify-center min-h-screen overflow-hidden p-4 animate-fade-in", theme.bg)}>
      {data.template === 'classic' && <Sparkles />}
      <Card className={cn(
          "w-full max-w-2xl text-center shadow-2xl p-4 md:p-8 transform transition-all duration-500 z-10",
          theme.card,
          data.template === 'playful' ? 'animate-wiggle' : 'hover:scale-[1.02]'
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
             <div className="relative aspect-video w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                    src={data.imageDataUrl}
                    alt={`Birthday surprise for ${data.recipientName}`}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
          )}
          <div className={cn("prose mx-auto p-6 rounded-xl", theme.prose)}>
            <p>{data.message}</p>
          </div>
        </CardContent>
        <CardFooter className="mt-8 justify-between items-center">
            <Link href="/" passHref>
                <Button variant="ghost" className="text-xs text-muted-foreground hover:bg-black/10">
                    Create Yours
                </Button>
            </Link>
            <p className={cn("font-body text-xl", theme.footer)}>With love, from {data.senderName}</p>
        </CardFooter>
      </Card>
    </div>
  );
}


export function MessageDisplay() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen text-xl font-body text-primary">
            Unwrapping your message...
        </div>
    }>
      <MessageContent />
    </Suspense>
  );
}
