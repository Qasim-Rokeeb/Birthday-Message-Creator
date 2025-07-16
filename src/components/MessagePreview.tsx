"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PartyPopper, Gift } from "lucide-react";
import Image from "next/image";

type MessagePreviewProps = {
  recipientName: string;
  senderName: string;
  message: string;
  imageDataUrl: string | null;
};

export function MessagePreview({ recipientName, senderName, message, imageDataUrl }: MessagePreviewProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl transition-all duration-300 rounded-2xl">
      <CardHeader className="text-center">
        <CardDescription>PREVIEW</CardDescription>
        <div className="flex justify-center items-center gap-4 mt-2">
          <Gift className="w-8 h-8 text-primary animate-pulse" />
          <CardTitle className="font-headline text-3xl text-primary">
            Happy Birthday, {recipientName || "..."}!
          </CardTitle>
          <PartyPopper className="w-8 h-8 text-primary animate-pulse" />
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
