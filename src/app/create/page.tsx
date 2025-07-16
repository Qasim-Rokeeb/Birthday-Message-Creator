
"use client";
import { BirthdaySchedulerForm } from "@/components/BirthdaySchedulerForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function CreatePageContent() {
    const searchParams = useSearchParams();
    const template = searchParams.get("template") as 'classic' | 'modern' | 'playful' | 'vibrant' | 'cozy' | 'minimalist' || 'classic';

    return (
        <main className="min-h-screen w-full transition-all duration-500 ease-in-out animate-fade-in bg-gradient-to-br from-background to-rose-50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Templates
                    </Link>
                </div>
                <BirthdaySchedulerForm selectedTemplate={template} />
            </div>
        </main>
    );
}

export default function CreatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePageContent />
        </Suspense>
    )
}
