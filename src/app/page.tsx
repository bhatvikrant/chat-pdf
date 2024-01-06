import { MoveRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div>
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <a
          className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
          href="/docs/changelog"
        >
          🎉{" "}
          <div
            data-orientation="vertical"
            role="none"
            className="mx-2 h-4 w-[1px] shrink-0 bg-border"
          ></div>{" "}
          <span className="sm:hidden">New components and more.</span>
          <span className="hidden sm:inline">
            New components, cli updates and more
          </span>
          <MoveRight className="ml-1 h-4 w-4" />
        </a>

        <h1 className="hidden text-center text-3xl font-bold leading-tight tracking-tighter md:block md:text-6xl lg:leading-[1.1]">
          Chat with any PDF document
        </h1>

        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:hidden md:text-6xl lg:leading-[1.1]">
          Chat with any PDF
        </h1>

        <span className="text-md inline-block max-w-[750px] text-center align-top text-muted-foreground sm:text-xl">
          From legal agreements to financial reports, ChatPDF brings your
          documents to life. You can ask questions, get summaries, find
          information, and more.
        </span>

        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button>Try now!</Button>
          <Button variant="link">link</Button>
        </div>
      </section>
    </div>
  );
}
