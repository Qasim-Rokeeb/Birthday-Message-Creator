import { BirthdaySchedulerForm } from "@/components/BirthdaySchedulerForm";
import { PartyPopper } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen w-full transition-all duration-500 ease-in-out animate-fade-in">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary flex items-center justify-center gap-4">
            <PartyPopper className="w-10 h-10 md:w-16 md:h-16" />
            BirthdayScheduler
          </h1>
          <p className="font-body text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
            Create and schedule the perfect birthday message for your loved ones with a little help from AI.
          </p>
        </header>
        <BirthdaySchedulerForm />
      </div>
    </main>
  );
}
