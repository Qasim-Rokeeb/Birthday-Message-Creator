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
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-4">
          <Gift className="w-8 h-8 text-primary animate-pulse" />
          <CardTitle className="font-headline text-3xl text-primary">
            Happy Birthday, {recipientName || "..."}!
          </CardTitle>
          <PartyPopper className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <CardDescription>This is a preview of your message</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageDataUrl && (
          <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted">
            <Image 
              src={imageDataUrl}
              alt="Uploaded preview"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div className="prose prose-lg mx-auto text-center font-body text-card-foreground min-h-[120px] bg-muted/30 p-4 rounded-md">
          <p>{message || "Your message will appear here..."}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
         <p className="font-body text-muted-foreground">With love, from {senderName || "..."}</p>
      </CardFooter>
    </Card>
  );
}
