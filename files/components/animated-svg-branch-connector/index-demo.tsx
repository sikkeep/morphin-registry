import Card from "@/components/card";
import SvgBranches from "@/components/svg-branches";
import Lines from "@/components/ui/lines";
import ResizeProvider from "./providers/resize";

function Demo() {
  return (
    <ResizeProvider uaString="">
      <div className="relative min-h-screen w-full grid gap-0 grid-cols-2 md:grid-cols-4 lg:grid-cols-8 grid-rows-4 bg-black px-5">
        <Lines className="px-5" rows={4} rowLines={[1, 3]} />
        <Card
          title="SVG Branches"
          description="A demo of animated SVG branches. A demo of animated SVG branches. A demo of animated SVG branches. A demo of animated SVG branches."
          className="relative z-10 col-span-2 md:col-start-2 lg:col-start-3 lg:col-span-4 xl:col-span-4 xl:col-start-3 row-start-2 row-span-2"
        >
          <SvgBranches width="100%" />
        </Card>
      </div>
    </ResizeProvider>
  );
}

export default Demo;
