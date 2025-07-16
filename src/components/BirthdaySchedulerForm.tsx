"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, WandSparkles, Loader2, Send, Gift, ImagePlus, User, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessagePreview } from "@/components/MessagePreview";
import { generateMessageSuggestions } from "@/ai/flows/generate-message-suggestions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  senderName: z.string().min(2, {
    message: "Your name must be at least 2 characters.",
  }),
  recipientName: z.string().min(2, {
    message: "Recipient's name must be at least 2 characters.",
  }),
  birthday: z.date({
    required_error: "Their birthday is required.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, {
    message: "Message must not be longer than 500 characters."
  }),
  image: z.any().optional(),
});

export function BirthdaySchedulerForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderName: "",
      recipientName: "",
      message: "",
    },
  });

  const { recipientName, senderName, message } = form.watch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 2MB.",
        });
        e.target.value = ""; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSuggestMessage = async () => {
    setIsSuggesting(true);
    const { recipientName, message, birthday } = form.getValues();
    if (!recipientName || !birthday) {
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: "Please fill in the recipient's name and birthday first.",
      });
      setIsSuggesting(false);
      return;
    }
    
    try {
      const result = await generateMessageSuggestions({
        recipientName,
        userMessage: message || 'A happy birthday message.',
        birthday: format(birthday, 'PPP'),
      });
      form.setValue("message", result.suggestedMessage, { shouldValidate: true });
    } catch (error) {
      console.error("Error generating message:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not generate a message. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const data = {
      ...values,
      birthday: format(values.birthday, 'PPP'),
      image: imageDataUrl, // Pass the data URL
    };
    // @ts-ignore
    delete data.image; // remove the File object if it exists
    const finalData = {...data, imageDataUrl};
    const encodedData = btoa(JSON.stringify(finalData));
    router.push(`/success?data=${encodedData}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
      <Card className="shadow-2xl border-primary/10 rounded-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center gap-3">
            <Gift className="w-8 h-8" />
            Create Your Message
          </CardTitle>
          <CardDescription>Fill in the details to create a personalized birthday page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User className="w-4 h-4" /> Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Alex" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User className="w-4 h-4"/> Recipient's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jamie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Their Birthday</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick their birthday</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><ImagePlus className="w-4 h-4" /> Add an Image (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} className="pt-2"/>
                    </FormControl>
                    <FormDescription>Max file size: 2MB.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Personalized Message</FormLabel>
                      <Button type="button" variant="ghost" size="sm" onClick={handleSuggestMessage} disabled={isSuggesting}>
                        {isSuggesting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <WandSparkles className="mr-2 h-4 w-4 text-accent" />
                        )}
                        Suggest with AI
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Type your birthday wish here..."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
                Create & Get Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="sticky top-24">
        <MessagePreview recipientName={recipientName} senderName={senderName} message={message} imageDataUrl={imageDataUrl} />
      </div>
    </div>
  );
}
