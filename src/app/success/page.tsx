// src/app/success/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Link as LinkIcon, Copy, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BirthdayData = {
  recipientName: string;
  senderName: string;
  message: string;
  birthday: string;
  imageDataUrl?: string;
  template: 'classic' | 'modern' | 'playful' | 'vibrant' | 'cozy' | 'minimalist';
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [data, setData] = useState<BirthdayData | null>(null);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    const storedData = sessionStorage.getItem(`birthday_data_${id}`);
    if (!storedData) {
      console.error("No data found in session storage for this id.");
      return;
    }

    (async () => {
      try {
        const parsed: BirthdayData = JSON.parse(storedData);
        const res = await fetch("/api/store", {
          method: "POST",
          body: JSON.stringify(parsed),
        });
        const { id: shortId } = await res.json();
        setShareLink(`${window.location.origin}/message/${shortId}`);
        setData(parsed);
      } catch (e) {
        console.error("Failed to upload message:", e);
      }
    })();
  }, [searchParams]);

  const copyToClipboard = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    toast({ title: "Copied!", description: "Link ready to share." });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="font-body text-xl">Loading your confirmation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-rose-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full mx-auto shadow-2xl border-primary/20 animate-fade-in rounded-2xl">
        <CardHeader className="text-center p-8">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-green-200">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="font-headline text-4xl text-primary">
            Your Message is Ready!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Share this special birthday page with {data.recipientName} on their birthday!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8 pt-0">
          <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-primary">
              <LinkIcon className="w-5 h-5" /> Your Sharable Link
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Copy this link and send it to {data.recipientName}. Anyone with the link can view the message.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="w-full bg-background p-2 rounded-lg border text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Link href={shareLink} passHref target="_blank">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                Preview Your Message
              </Button>
            </Link>
          </div>

          <div className="p-6 border-t mt-6">
            <Gift className="w-8 h-8 mx-auto text-primary" />
            <p className="font-bold">Happy sharing!</p>
            <p className="text-sm text-muted-foreground">
              On {data.birthday}, send the link to {data.recipientName} via email, text, or any way you like!
            </p>
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
  );
}