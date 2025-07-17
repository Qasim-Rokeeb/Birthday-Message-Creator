"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  WandSparkles,
  Loader2,
  Send,
  Gift,
  ImagePlus,
  User,
} from "lucide-react";

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

type Template =
  | "classic"
  | "modern"
  | "playful"
  | "vibrant"
  | "cozy"
  | "minimalist"
  | "neon"
  | "retro"
  | "ocean";

const formSchema = z.object({
  senderName: z.string().min(2, { message: "Your name must be at least 2 characters." }),
  recipientName: z.string().min(2, { message: "Recipient's name must be at least 2 characters." }),
  birthday: z.date({ required_error: "Their birthday is required." }),
  message: z.string().min(10).max(500),
  imageFile: z.any().optional(),
  template: z.enum([
    "classic",
    "modern",
    "playful",
    "vibrant",
    "cozy",
    "minimalist",
    "neon",
    "retro",
    "ocean",
  ]),
});

const templateDetails: Record<Template, { name: string }> = {
  classic: { name: "Classic Elegance" },
  modern: { name: "Modern Chic" },
  playful: { name: "Playful Fun" },
  vibrant: { name: "Vibrant Joy" },
  cozy: { name: "Cozy Charm" },
  minimalist: { name: "Minimalist Peace" },
  neon: { name: "Neon Party" },
  retro: { name: "Retro Vibes" },
  ocean: { name: "Ocean Dreams" },
};

const themes: Record<Template, string> = {
  classic:
    "bg-gradient-to-br from-rose-100 via-stone-50 to-rose-200 dark:from-rose-900 dark:to-stone-800",
  modern:
    "bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800",
  playful:
    "bg-gradient-to-br from-purple-100 via-pink-50 to-amber-100 dark:from-purple-900 dark:to-pink-900",
  vibrant:
    "bg-gradient-to-br from-yellow-100 via-red-50 to-fuchsia-100 dark:from-yellow-900 dark:to-red-900",
  cozy:
    "bg-gradient-to-br from-emerald-100 via-cyan-50 to-sky-100 dark:from-emerald-900 dark:to-sky-900",
  minimalist:
    "bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:to-slate-800",
  neon: "bg-gradient-to-br from-cyan-100 via-purple-50 to-pink-100 dark:from-cyan-900 dark:to-purple-900",
  retro: "bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100 dark:from-orange-800 dark:to-red-800",
  ocean: "bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100 dark:from-teal-800 dark:to-blue-800",
};

export function BirthdaySchedulerForm({ selectedTemplate }: { selectedTemplate: Template }) {
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
      template: selectedTemplate,
    },
  });

  useEffect(() => {
    form.setValue("template", selectedTemplate);
  }, [selectedTemplate, form]);

  const { recipientName, senderName, message, template } = form.watch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 2MB.",
        });
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImageDataUrl(reader.result as string);
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
        userMessage: message || "A happy birthday message.",
        birthday: format(birthday, "PPP"),
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
    const { imageFile, ...restOfValues } = values;
    const data = {
      ...restOfValues,
      birthday: format(values.birthday, "PPP"),
      imageDataUrl: imageDataUrl,
    };

    const randomId = Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem(`birthday_data_${randomId}`, JSON.stringify(data));
    router.push(`/success?id=${randomId}`);
  };

  return (
    <Form {...form}>
      <div className={cn("min-h-screen w-full flex items-start justify-center p-2 sm:p-4", themes[template])}>
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Form Card */}
          <Card className="shadow-2xl border-primary/10 rounded-2xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-2xl sm:text-3xl text-primary flex items-center gap-3">
                <Gift className="w-7 h-7 sm:w-8" />
                Create Your Message
              </CardTitle>
              <CardDescription>
                You've selected the{" "}
                <span className="font-bold text-primary">{templateDetails[template].name}</span>{" "}
                template. Let's personalize it!
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" /> Your Name
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" /> Recipient's Name
                        </FormLabel>
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
                      <FormLabel className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> Their Birthday
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Pick their birthday"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
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
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ImagePlus className="w-4 h-4" /> Add an Image (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/png, image/jpeg, image/gif"
                          onChange={handleImageChange}
                          className="pt-2"
                        />
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSuggestMessage}
                          disabled={isSuggesting}
                        >
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
                  Create & Get Link
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview – always visible on large screens, scrollable on small */}
          <div className="w-full lg:sticky lg:top-24">
            <MessagePreview
              recipientName={recipientName}
              senderName={senderName}
              message={message}
              imageDataUrl={imageDataUrl}
              template={template}
            />
          </div>
        </div>
      </div>
    </Form>
  );
}