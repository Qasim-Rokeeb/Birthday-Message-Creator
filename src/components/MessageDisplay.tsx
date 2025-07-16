"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PartyPopper, Gift, Sparkle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type BirthdayData = {
  recipientName: string;
  senderName: string;
  message: string;
  imageDataUrl?: string;
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


export function MessageDisplay() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<BirthdayData | null>(null);

  useEffect(() => {
    const encodedData = searchParams.get("data");
    if (encodedData) {
      try {
        const decodedData = atob(encodedData);
        setData(JSON.parse(decodedData));
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

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 overflow-hidden p-4 animate-fade-in">
      <Sparkles />
      <Card className="w-full max-w-2xl text-center shadow-2xl p-4 md:p-8 transform transition-all duration-500 hover:scale-[1.02] z-10 bg-white/80 backdrop-blur-lg rounded-3xl border-primary/20">
        <CardHeader>
          <div className="flex justify-center items-center gap-4">
            <Gift className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <CardTitle className="font-headline text-4xl md:text-6xl text-primary">
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
          <div className="prose prose-2xl mx-auto font-body text-foreground/80 bg-black/5 p-6 rounded-xl">
            <p>{data.message}</p>
          </div>
        </CardContent>
        <CardFooter className="mt-8 justify-end">
          <p className="font-body text-xl text-muted-foreground italic">With love, from {data.senderName}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
