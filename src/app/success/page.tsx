"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Link as LinkIcon, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BirthdayData = {
  recipientName: string;
  senderName: string;
  message: string;
  birthday: string;
  imageDataUrl?: string;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [data, setData] = useState<BirthdayData | null>(null);
  const [uniqueUrl, setUniqueUrl] = useState("");

  useEffect(() => {
    const encodedData = searchParams.get("data");

    if (encodedData) {
      try {
        const decodedData = atob(encodedData);
        const parsedData: BirthdayData = JSON.parse(decodedData);
        setData(parsedData);
        const randomId = Math.random().toString(36).substring(2, 10);
        const url = `/message/${randomId}?data=${encodedData}`;
        setUniqueUrl(url);
      } catch (error) {
        console.error("Failed to parse data:", error);
      }
    }
  }, [searchParams]);

  const copyToClipboard = () => {
    if (!uniqueUrl) return;
    const fullUrl = `${window.location.origin}${uniqueUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share the link with the birthday person!",
    });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="font-body text-xl">Loading your confirmation...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <Card className="max-w-2xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="font-headline text-3xl text-primary">
            Your Message is Ready!
          </CardTitle>
          <CardDescription className="text-lg">
            Share this special birthday message with {data.recipientName} on their birthday, {data.birthday}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Your Sharable Link</h3>
            <p className="text-sm text-muted-foreground mb-3">Copy this link and send it to {data.recipientName}!</p>
            <div className="flex items-center gap-2">
                <input type="text" readOnly value={`${(typeof window !== 'undefined' && window.location.origin) || ''}${uniqueUrl}`} className="w-full bg-background p-2 rounded-md border text-sm" />
                <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy link">
                  <Copy className="w-4 h-4" />
                </Button>
            </div>
            <div className="mt-4">
                <Link href={uniqueUrl} passHref target="_blank">
                    <Button className="w-full bg-accent hover:bg-accent/90">Preview Your Message</Button>
                </Link>
            </div>
          </div>
          
          <div className="p-4 border-t">
            <h3 className="font-bold mb-2 text-center text-muted-foreground">What to do next</h3>
             <div className="text-center text-sm text-foreground">
                <p>1. Copy the link above.</p>
                <p>2. On {data.birthday}, send it to {data.recipientName} via email, text, or any way you like!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
