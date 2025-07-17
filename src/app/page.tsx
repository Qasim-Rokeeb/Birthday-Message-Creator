"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Gift, Sparkles, Heart, ChevronRight } from "lucide-react";

const templates = [
  { id: "classic", name: "Classic Elegance", hint: "Timeless & refined" },
  { id: "modern", name: "Modern Chic", hint: "Sleek & bold" },
  { id: "playful", name: "Playful Fun", hint: "Colorful & joyful" },
  { id: "vibrant", name: "Vibrant Joy", hint: "Energy & warmth" },
  { id: "cozy", name: "Cozy Charm", hint: "Warm & intimate" },
  { id: "minimalist", name: "Minimal Peace", hint: "Calm & clean" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="relative">
          <Gift className="w-20 h-20 text-rose-500 animate-bounce" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-ping" />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 mt-6">
          Birthday Wish Creator
        </h1>
        <p className="max-w-2xl mt-4 text-lg text-muted-foreground">
          Craft unforgettable, AI-powered birthday messages in seconds.
        </p>
        <Link href="/create">
          <Button
            size="lg"
            className="mt-8 gap-2 group"
            onClick={() =>
              document
                .getElementById("templates")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Creating
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>

      {/* Template Carousel */}
      <section id="templates" className="container mx-auto px-4 pb-24">
        <h2 className="text-center font-headline text-3xl mb-12 text-slate-700 dark:text-slate-200">
          Pick Your Style
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((t) => (
            <Link key={t.id} href={`/create?template=${t.id}`} passHref>
              <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1">
                <Image
                  src={`https://placehold.co/400x300.png`}
                  alt={t.name}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="font-headline text-2xl font-bold">{t.name}</h3>
                  <p className="text-sm opacity-80">{t.hint}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
                  <Heart className="w-5 h-5 text-rose-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Confetti */}
      <footer className="text-center py-12">
        <Sparkles className="inline-block w-6 h-6 text-amber-400 animate-pulse" />
        <p className="text-muted-foreground mt-2">Powered by AI & love.</p>
      </footer>
    </main>
  );
}