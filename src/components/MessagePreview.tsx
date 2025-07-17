"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PartyPopper, Gift, Sun, Heart, Sparkle, Cake } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Template = 'classic' | 'modern' | 'playful' | 'vibrant' | 'cozy' | 'minimalist' | 'neon' | 'retro' | 'ocean';

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
      cardBg: "bg-gradient-to-br from-gray-50 to-gray-100",
      titleColor: "text-primary"
    },
    modern: {
      cardBg: "bg-gradient-to-br from-slate-900 to-slate-800",
      titleColor: "text-white"
    },
    playful: {
      cardBg: "bg-gradient-to-br from-purple-200 via-rose-200 to-amber-200",
      titleColor: "text-pink-500"
    },
    vibrant: {
      cardBg: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-red-500 to-fuchsia-500",
      titleColor: "text-white"
    },
    cozy: {
      cardBg: "bg-gradient-to-br from-emerald-100 to-sky-200",
      titleColor: "text-green-800"
    },
    minimalist: {
      cardBg: "bg-gradient-to-br from-slate-50 to-white",
      titleColor: "text-gray-800"
    },
    neon: {
      cardBg: "bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-600 dark:from-cyan-900 dark:to-purple-900",
      titleColor: "text-cyan-400"
    },
    retro: {
      cardBg: "bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 dark:from-orange-800 dark:to-red-800",
      titleColor: "text-orange-600"
    },
    ocean: {
      cardBg: "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 dark:from-teal-800 dark:to-blue-800",
      titleColor: "text-teal-700"
    }
  };

  const styles = templateStyles[template] || templateStyles.classic;
  const isDark = ['modern', 'vibrant'].includes(template);

  return (
    <Card className={cn("backdrop-blur-sm border-primary/20 shadow-xl transition-all duration-300 rounded-2xl", styles.cardBg)}>
      <CardHeader className="text-center">
        <CardDescription className={cn(isDark ? "text-slate-400" : "text-muted-foreground")}>PREVIEW</CardDescription>
        <div className="flex justify-center items-center gap-4 mt-2">
          <Gift className={cn("w-8 h-8 animate-pulse", styles.titleColor)} />
          <CardTitle className={cn("font-headline text-3xl", styles.titleColor)}>
            Happy Birthday, {recipientName || "..."}!
          </CardTitle>
          <PartyPopper className={cn("w-8 h-8 animate-pulse", styles.titleColor)} />
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
        <div className={cn(
            "prose prose-lg mx-auto text-center font-body min-h-[120px] p-4 rounded-lg", 
            isDark ? "text-slate-300 bg-black/20" : "text-card-foreground bg-muted/30"
          )}>
          <p>{message || "Your message will appear here..."}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
         <p className={cn("font-body italic", isDark ? "text-slate-400" : "text-muted-foreground")}>With love, from {senderName || "..."}</p>
      </CardFooter>
    </Card>
  );
}