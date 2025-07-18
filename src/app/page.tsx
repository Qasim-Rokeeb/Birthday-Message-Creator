"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Gift, Sparkles, Heart, ChevronRight } from "lucide-react";

/* 1.  Placeholder images – swap the src later */
const templates = [
  { id: "classic", name: "Classic Elegance", hint: "Timeless & refined", tw: "from-rose-400 to-pink-500" },
  { id: "modern", name: "Modern Chic", hint: "Sleek & bold", tw: "from-slate-400 to-slate-600" },
  { id: "playful", name: "Playful Fun", hint: "Colorful & joyful", tw: "from-purple-400 to-pink-400" },
  { id: "vibrant", name: "Vibrant Joy", hint: "Energy & warmth", tw: "from-yellow-400 to-orange-500" },
  { id: "cozy", name: "Cozy Charm", hint: "Warm & intimate", tw: "from-emerald-400 to-teal-500" },
  { id: "minimalist", name: "Minimal Peace", hint: "Calm & clean", tw: "from-slate-300 to-slate-400" },
  { id: "neon", name: "Neon Party", hint: "Electric & futuristic", tw: "from-cyan-400 via-pink-500 to-purple-600" },
  { id: "retro", name: "Retro Vibes", hint: "Vintage & funky", tw: "from-orange-400 via-red-500 to-yellow-400" },
  { id: "ocean", name: "Ocean Dreams", hint: "Fresh & breezy", tw: "from-teal-400 via-cyan-500 to-blue-500" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="relative">
          <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-rose-500 animate-bounce" />
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-ping" />
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 mt-6">
          Birthday Message Creator
        </h1>
        <p className="max-w-2xl mt-4 text-base sm:text-lg text-muted-foreground">
          Craft unforgettable, AI-powered birthday messages in seconds.
        </p>
        <Link href="/create">
          <Button size="lg" className="mt-8 gap-2 group">
            Start Creating <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>

      {/* Mobile-first grid */}
      <section id="templates" className="container mx-auto px-4 pb-20">
        <h2 className="text-center font-headline text-2xl sm:text-3xl mb-10 sm:mb-12 text-slate-700 dark:text-slate-200">
          Pick Your Style
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templates.map((t) => (
            <Link key={t.id} href={`/create?template=${t.id}`} passHref>
                   <div className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${t.tw}`}
>
                <div className="aspect-[4/3] w-full" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h3 className="font-headline text-xl sm:text-2xl font-bold">{t.name}</h3>
                  <p className="text-xs sm:text-sm opacity-80">{t.hint}</p>
                </div>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12">
        <Sparkles className="inline-block w-6 h-6 text-amber-400 animate-pulse" />
        <p className="text-muted-foreground mt-2">Powered by AI & love.</p>
      </footer>
    </main>
  );
}