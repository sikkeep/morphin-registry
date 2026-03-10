import { UniqueAccordion } from "@/components/interactive-accordion";

export default function InteractiveAccordionDemo() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <h1 className="mb-3 text-4xl font-medium tracking-tight text-balance">
            What we do
          </h1>
          <p className="text-lg text-muted-foreground">
            Transforming ideas into exceptional digital experiences.
          </p>
        </div>
        <UniqueAccordion />
      </div>
    </main>
  );
}
