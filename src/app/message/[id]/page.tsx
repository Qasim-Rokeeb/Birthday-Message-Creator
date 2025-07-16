// src/app/message/[id]/page.tsx
import { MessageDisplay } from "@/components/MessageDisplay";

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <main>
      <MessageDisplay id={id} />
    </main>
  );
}