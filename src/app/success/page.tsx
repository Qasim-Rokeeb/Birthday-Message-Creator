"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Link as LinkIcon, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BirthdayData = {
  recipientName: string;
  recipientEmail: string;
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
  const [sentNow, setSentNow] = useState(false);

  useEffect(() => {
    const encodedData = searchParams.get("data");
    const sentParam = searchParams.get("sent");
    setSentNow(sentParam === "true");

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
      description: "You can now share the link directly.",
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
            {sentNow ? "Message Sent!" : "Message Scheduled!"}
          </CardTitle>
          <CardDescription className="text-lg">
            Your birthday message for {data.recipientName} is all set.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Your Unique Link</h3>
            <div className="flex items-center gap-2">
                <input type="text" readOnly value={`${(typeof window !== 'undefined' && window.location.origin) || ''}${uniqueUrl}`} className="w-full bg-background p-2 rounded-md border text-sm" />
                <Button variant="ghost" size="icon" onClick={copyToClipboard}><Copy className="w-4 h-4" /></Button>
            </div>
            <div className="mt-4">
                <Link href={uniqueUrl} passHref>
                    <Button className="w-full bg-accent hover:bg-accent/90">Preview Message Page</Button>
                </Link>
            </div>
          </div>
          
          <div className="p-4 border-t">
            <h3 className="font-bold mb-2 text-center text-muted-foreground">Email Confirmation</h3>
            <div className="p-6 bg-white dark:bg-card rounded-lg shadow-inner border">
              <h4 className="font-bold text-lg text-foreground">Subject: A Special Birthday Surprise from {data.senderName}!</h4>
              <hr className="my-4"/>
              <p className="text-foreground">Hello {data.recipientName},</p>
              <p className="my-4 text-foreground">{data.senderName} has sent you a special birthday message! Click the button below to view it.</p>
              <div className="text-center my-6">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a href="#">View Your Message</a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Warmly,<br/>The BirthdayScheduler Team</p>
            </div>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              An email like this will be sent to <span className="font-semibold">{data.recipientEmail}</span> on {data.birthday}.
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
    )
}
