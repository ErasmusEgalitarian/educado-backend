import { mdiOpenInNew } from "@mdi/js";
import Icon from "@mdi/react";

import { Button } from "@/shared/components/shadcn/button";
import { Card, CardContent } from "@/shared/components/shadcn/card";

const DemoIntroduction = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-4 text-3xl font-bold">
          Welcome to the Component Library Demo
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          This interactive documentation serves as a comprehensive guide to the
          reusable components that power our application. Here you can explore
          various UI elements, understand their usage patterns, and see them in
          action with live examples.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Purpose</h3>
        <p className="text-muted-foreground leading-relaxed">
          The primary goal of this demo page is to showcase how the reusable
          components of our application can be effectively used throughout the
          codebase. Each component is demonstrated with practical examples,
          complete with code snippets and interactive previews, making it easy
          for developers to understand implementation details and best
          practices.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Built with Shadcn/ui</h3>
        <p className="text-muted-foreground leading-relaxed">
          Our component library is primarily driven by{" "}
          <a
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Shadcn/ui
          </a>
          , a collection of beautifully designed, accessible, and customizable
          components built with Radix UI and Tailwind CSS. These components
          provide a solid foundation that we&apos;ve modified and extended to
          match our specific application requirements.
        </p>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">Component Location</p>
                <code className="text-muted-foreground block rounded bg-black/5 px-3 py-2 text-sm dark:bg-white/5">
                  /src/shared/components/shadcn
                </code>
                <p className="text-muted-foreground text-sm">
                  All Shadcn components are stored in this directory and have
                  been customized to integrate seamlessly with our
                  application&apos;s design system and functional requirements.
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a
                  href="https://ui.shadcn.com/docs/components"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Shadcn Docs
                  <Icon path={mdiOpenInNew} size={0.6} />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Navigation</h3>
        <p className="text-muted-foreground leading-relaxed">
          The menu at the top of this page provides easy access to different
          categories of reusable elements. Each tab demonstrates:
        </p>
        <ul className="text-muted-foreground ml-6 list-disc space-y-2 leading-relaxed">
          <li>
            <strong className="font-medium text-foreground">
              Component Props:
            </strong>{" "}
            Detailed documentation of all available properties and their types
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Usage Examples:
            </strong>{" "}
            Multiple real-world examples showing different configurations and
            use cases
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Code Snippets:
            </strong>{" "}
            Copy-ready code that you can immediately use in your components
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Live Previews:
            </strong>{" "}
            Interactive demonstrations showing components in action
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Getting Started</h3>
        <p className="text-muted-foreground leading-relaxed">
          Select any tab from the menu above to explore specific components.
          Each component page includes comprehensive documentation, multiple
          examples demonstrating different variants and states, and best
          practices for implementation. Feel free to experiment with the
          interactive demos to better understand how each component behaves.
        </p>
        <div className="bg-muted/50 rounded-lg border p-4">
          <p className="text-sm font-medium">💡 Tip</p>
          <p className="text-muted-foreground mt-1 text-sm">
            All components are built with accessibility in mind and follow
            modern React patterns. They&apos;re fully typed with TypeScript for
            the best developer experience.
          </p>
        </div>
      </section>
    </div>
  );
};

export default DemoIntroduction;
