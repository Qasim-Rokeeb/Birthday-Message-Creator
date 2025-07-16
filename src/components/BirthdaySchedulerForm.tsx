"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, WandSparkles, Loader2, Send, CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagePreview } from "@/components/MessagePreview";
import { generateMessageSuggestions } from "@/ai/flows/generate-message-suggestions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  recipientName: z.string().min(2, {
    message: "Recipient's name must be at least 2 characters.",
  }),
  birthday: z.date({
    required_error: "A birthday is required.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, {
    message: "Message must not be longer than 500 characters."
  }),
});

export function BirthdaySchedulerForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      message: "",
    },
  });

  const recipientName = form.watch("recipientName");
  const message = form.watch("message");

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

  const onSubmit = (values: z.infer<typeof formSchema>, sentNow: boolean) => {
    const data = {
      ...values,
      birthday: format(values.birthday, 'PPP'),
    };
    const encodedData = btoa(JSON.stringify(data));
    router.push(`/success?data=${encodedData}&sent=${sentNow}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Create Your Message</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birthday</FormLabel>
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
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
                        Suggest
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
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" onClick={form.handleSubmit((v) => onSubmit(v, false))} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <CalendarPlus className="mr-2 h-4 w-4"/>
                  Schedule Message
                </Button>
                <Button type="button" onClick={form.handleSubmit((v) => onSubmit(v, true))} className="w-full" variant="secondary">
                  <Send className="mr-2 h-4 w-4" />
                  Send Immediately
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="sticky top-24">
        <MessagePreview recipientName={recipientName} message={message} />
      </div>
    </div>
  );
}
