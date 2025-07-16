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
    // We are using a fixed set of sparkles for a consistent, subtle animation
    const sparkleData = [
      { top: '10%', left: '10%', size: 'w-6 h-6', delay: '0s' },
      { top: '20%', left: '80%', size: 'w-4 h-4', delay: '0.2s' },
      { top: '80%', left: '20%', size: 'w-5 h-5', delay: '0.4s' },
      { top: '60%', left: '90%', size: 'w-7 h-7', delay: '0.6s' },
      { top: '40%', left: '5%', size: 'w-3 h-3', delay: '0.8s' },
      { top: '90%', left: '60%', size: 'w-5 h-5', delay: '1s' },
    ];
  
    return (
      <>
        {sparkleData.map((s, i) => (
          <Sparkle
            key={i}
            className={`absolute ${s.size} text-primary animate-pulse opacity-70`}
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-2xl text-center shadow-2xl p-8">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden p-4 animate-fade-in">
      <Sparkles />
      <Card className="w-full max-w-2xl text-center shadow-2xl p-4 md:p-8 transform transition-all duration-500 scale-100 hover:scale-[1.02] z-10">
        <CardHeader>
          <div className="flex justify-center items-center gap-4">
            <Gift className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <CardTitle className="font-headline text-3xl md:text-5xl text-primary">
              Happy Birthday, {data.recipientName}!
            </CardTitle>
            <PartyPopper className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="mt-4 space-y-6">
          {data.imageDataUrl && (
             <div className="relative aspect-video w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg">
                <Image
                    src={data.imageDataUrl}
                    alt={`Birthday surprise for ${data.recipientName}`}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
          )}
          <div className="prose prose-xl mx-auto font-body text-foreground">
            <p>{data.message}</p>
          </div>
        </CardContent>
        <CardFooter className="mt-6 justify-end">
          <p className="font-body text-muted-foreground">With love, from {data.senderName}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
