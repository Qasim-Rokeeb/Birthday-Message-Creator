
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Sparkles, Paintbrush } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const templates = [
  { id: 'classic', name: 'Classic Elegance', image: 'https://placehold.co/400x300.png', hint: 'elegant' },
  { id: 'modern', name: 'Modern Chic', image: 'https://placehold.co/400x300.png', hint: 'modern' },
  { id: 'playful', name: 'Playful Fun', image: 'https://placehold.co/400x300.png', hint: 'playful' },
  { id: 'vibrant', name: 'Vibrant Joy', image: 'https://placehold.co/400x300.png', hint: 'vibrant joy' },
  { id: 'cozy', name: 'Cozy Charm', image: 'https://placehold.co/400x300.png', hint: 'cozy' },
  { id: 'minimalist', name: 'Minimalist Peace', image: 'https://placehold.co/400x300.png', hint: 'minimalist' },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full transition-all duration-500 ease-in-out animate-fade-in bg-gradient-to-br from-background to-rose-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary flex items-center justify-center gap-4">
            <Gift className="w-12 h-12 md:w-20 md:h-20 transform -rotate-12 text-accent" />
            Birthday Wish Creator
          </h1>
          <p className="font-body text-muted-foreground mt-6 text-xl max-w-3xl mx-auto">
            Create and share the perfect, personalized birthday message. Start by choosing a template below!
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {templates.map((template) => (
            <Link key={template.id} href={`/create?template=${template.id}`} passHref>
              <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-primary/10">
                <Image
                  src={template.image}
                  alt={template.name}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={template.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <CardContent className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="font-headline text-2xl font-bold text-white group-hover:text-accent transition-colors">
                    {template.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <footer className="text-center mt-16">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Powered by AI for extra special messages.
          </p>
        </footer>
      </div>
    </main>
  );
}
