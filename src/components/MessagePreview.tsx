"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, Gift } from "lucide-react";

type MessagePreviewProps = {
  recipientName: string;
  message: string;
};

export function MessagePreview({ recipientName, message }: MessagePreviewProps) {
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
      <CardContent>
        <div className="prose prose-lg mx-auto text-center font-body text-card-foreground min-h-[120px] bg-muted/30 p-4 rounded-md">
          <p>{message || "Your message will appear here..."}</p>
        </div>
      </CardContent>
    </Card>
  );
}
