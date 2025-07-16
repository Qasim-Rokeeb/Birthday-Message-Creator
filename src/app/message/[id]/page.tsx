
import { MessageDisplay } from "@/components/MessageDisplay";

export default function MessagePage({ params }: { params: { id: string } }) {
  return (
    <main>
      <MessageDisplay id={params.id} />
    </main>
  );
}
