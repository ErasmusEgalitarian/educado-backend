import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/shadcn/tabs";

import ButtonDemo from "../components/button-demo";
import FormDemo from "../components/form-demo";
import FormInputDemo from "../components/form-input-demo";

const DemoPage = () => {
  return (
    <main className="container mx-auto py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Component Library</h1>
        <p className="text-muted-foreground text-lg">
          Explore our collection of reusable components with examples and
          documentation.
        </p>
      </div>

      <Tabs defaultValue="input" className="w-full">
        <TabsList>
          <TabsTrigger value="button">Buttons</TabsTrigger>
          <TabsTrigger value="form">Form Basics</TabsTrigger>
          <TabsTrigger value="input">Input</TabsTrigger>
        </TabsList>
        <TabsContent value="button">
          <ButtonDemo />
        </TabsContent>
        <TabsContent value="form">
          <FormDemo />
        </TabsContent>
        <TabsContent value="input">
          <FormInputDemo />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default DemoPage;
