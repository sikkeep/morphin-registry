import Card from "@/components/card";

import CardAnimation01 from "@/components/card-animation-01";
import CardAnimation02 from "@/components/card-animation-02";
import CardAnimation03 from "@/components/card-animation-03";
import CardAnimation04 from "@/components/card-animation-04";

export default function GridAnimatedCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 p-2 md:p-5 gap-2 w-full max-w-4xl">
      <Card
        title="All Your Messages In One Place"
        description="Manage email, chat, social and support tickets from a single smart inbox. No more switching tabs."
      >
        <CardAnimation01 className="scale-75 sm:scale-90" />
      </Card>
      <Card
        title="Instant Processing"
        description="AI works in real time to process messages, emails, and tickets. No more waiting for manual processing."
      >
        <CardAnimation02 className="scale-90" />
      </Card>
      <Card
        title="Smart Assignment"
        description="Automatically route messages to the right team member based on the message content."
      >
        <CardAnimation03 className="scale-90" />
      </Card>
      <Card
        title="AI Conversations Summary"
        description="Quickly understand the context of a conversation and get a summary of the key points."
      >
        <CardAnimation04 className="scale-80 md:scale-90" />
      </Card>
    </div>
  );
}
