import { mdiContentCopy, mdiCheck } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";

import { Button } from "@/shared/components/shadcn/button";
import { Card } from "@/shared/components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/shadcn/tabs";

import type React from "react";

interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface ComponentExample {
  title: string;
  description?: string;
  code: string;
  preview: React.ReactNode;
}

interface ComponentDemoProps {
  componentName: string;
  description: string;
  /** Primitive / base component props */
  props: PropDefinition[];
  /** Primitive examples */
  examples: ComponentExample[];
  /** Optional: form-integrated props (if different) */
  formProps?: PropDefinition[];
  /** Optional: form-integrated examples; when provided, a Primitive/Form tab UI is rendered */
  formExamples?: ComponentExample[];
  /** Optional initial tab ("primitive" | "form") when formExamples exist */
  defaultTab?: "primitive" | "form";
}

export const ComponentDemo = ({
  componentName,
  description,
  props,
  examples,
  formProps,
  formExamples,
  defaultTab = "primitive",
}: ComponentDemoProps) => {
  const hasForm = !!formExamples && formExamples.length > 0;

  const PrimitiveBlock = (
    <div className="space-y-10">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Examples</h3>
        {examples.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No primitive examples provided.
          </p>
        ) : (
          <div className="space-y-8">
            {examples.map((example) => (
              <ExampleCard key={`prim-${example.title}`} example={example} />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Props</h3>
        <PropsTable props={props} />
      </div>
    </div>
  );

  const FormBlock = hasForm && (
    <div className="space-y-10">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Form Examples</h3>
        {Array.isArray(formExamples) && formExamples.length > 0 ? (
          <div className="space-y-8">
            {formExamples.map((example) => (
              <ExampleCard key={`form-${example.title}`} example={example} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No form examples provided.
          </p>
        )}
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Form Props</h3>
        <PropsTable props={formProps ?? props} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{componentName}</h2>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      {!hasForm && PrimitiveBlock}
      {hasForm && (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList>
            <TabsTrigger value="primitive">Primitive</TabsTrigger>
            <TabsTrigger value="form">Form</TabsTrigger>
          </TabsList>
          <TabsContent value="primitive" className="space-y-8">
            {PrimitiveBlock}
          </TabsContent>
          <TabsContent value="form" className="space-y-8">
            {FormBlock}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const ExampleCard = ({ example }: { example: ComponentExample }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden">
      <div className="space-y-4 p-6">
        <div className="space-y-1">
          <h4 className="font-semibold">{example.title}</h4>
          {example.description != undefined && (
            <p className="text-muted-foreground text-sm">
              {example.description}
            </p>
          )}
        </div>

        {/* Visual Preview */}
        <div className="border-border bg-muted/30 flex min-h-[120px] items-center justify-center rounded-lg border p-8">
          {example.preview}
        </div>

        {/* Code Snippet */}
        <div className="relative">
          <div className="bg-muted/50 rounded-lg border p-4">
            <pre className="overflow-x-auto text-sm">
              <code className="font-mono">{example.code}</code>
            </pre>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2"
            onClick={() => void handleCopy()}
          >
            {copied ? (
              <Icon path={mdiCheck} size={1} />
            ) : (
              <Icon path={mdiContentCopy} size={1} />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const PropsTable = ({ props }: { props: PropDefinition[] }) => {
  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-border border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Prop
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Default
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {props.map((prop) => (
              <tr key={prop.name} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                    {prop.name}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code className="text-muted-foreground text-sm font-mono">
                    {prop.type}
                  </code>
                </td>
                <td className="px-4 py-3">
                  {prop.default == undefined ? (
                    <code className="text-muted-foreground text-sm font-mono">
                      {prop.default}
                    </code>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </td>
                <td className="text-muted-foreground px-4 py-3 text-sm">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
