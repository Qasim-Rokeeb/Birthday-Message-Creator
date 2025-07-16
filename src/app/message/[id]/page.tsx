import { MessageDisplay } from "@/components/MessageDisplay";
import { Suspense } from "react";

function MessageDisplayFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen text-xl font-body text-primary">
            Unwrapping your message...
        </div>
    );
}

export default function MessagePage() {
  return (
    <main>
      <Suspense fallback={<MessageDisplayFallback />}>
        <MessageDisplay />
      </Suspense>
    </main>
  );
}
