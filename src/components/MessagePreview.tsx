
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PartyPopper, Gift, Sun, Heart, Sparkle, Cake } from "lucide-react";
import Image from "next/image";

type Template = 'classic' | 'modern' | 'playful' | 'vibrant' | 'cozy' | 'minimalist';

type MessagePreviewProps = {
  recipientName: string;
  senderName: string;
  message: string;
  imageDataUrl: string | null;
  template: Template;
};

export function MessagePreview({ recipientName, senderName, message, imageDataUrl, template }: MessagePreviewProps) {
  
  const templateStyles = {
    classic: {
        cardBg: "bg-card/80",
        titleColor: "text-primary"
    },
    modern: {
        cardBg: "bg-slate-800",
        titleColor: "text-white"
    },
    playful: {
        cardBg: "bg-pink-50",
        titleColor: "text-pink-500"
    },
    vibrant: {
        cardBg: "bg-orange-50",
        titleColor: "text-orange-600"
    },
    cozy: {
        cardBg: "bg-green-50",
        titleColor: "text-green-800"
    },
    minimalist: {
        cardBg: "bg-gray-50",
        titleColor: "text-gray-800"
    }
  }

  const styles = templateStyles[template] || templateStyles.classic;

  return (
    <Card className={`backdrop-blur-sm border-primary/20 shadow-xl transition-all duration-300 rounded-2xl ${styles.cardBg}`}>
      <CardHeader className="text-center">
        <CardDescription>PREVIEW</CardDescription>
        <div className="flex justify-center items-center gap-4 mt-2">
          <Gift className={`w-8 h-8 ${styles.titleColor} animate-pulse`} />
          <CardTitle className={`font-headline text-3xl ${styles.titleColor}`}>
            Happy Birthday, {recipientName || "..."}!
          </CardTitle>
          <PartyPopper className={`w-8 h-8 ${styles.titleColor} animate-pulse`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageDataUrl ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <Image 
              src={imageDataUrl}
              alt="Uploaded preview"
              layout="fill"
              objectFit="cover"
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Image will appear here</p>
          </div>
        )}
        <div className="prose prose-lg mx-auto text-center font-body text-card-foreground min-h-[120px] bg-muted/30 p-4 rounded-lg">
          <p>{message || "Your message will appear here..."}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
         <p className="font-body text-muted-foreground italic">With love, from {senderName || "..."}</p>
      </CardFooter>
    </Card>
  );
}
