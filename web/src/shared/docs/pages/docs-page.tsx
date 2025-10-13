import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/shadcn/tabs";

import ButtonDemo from "../components/button-demo";
import DataDisplayDemo from "../components/data-display-demo";
import DemoIntroduction from "../components/demo-introduction";
import ErrorDemo from "../components/error-demo";
import FormDemo from "../components/form-demo";
import FormInputDemo from "../components/form-input-demo";
import FormTextareaDemo from "../components/form-textarea-demo";
import GlobalLoaderDemo from "../components/global-loader-demo";
import InternationalizationDemo from "../components/internationalization-demo";
import MultiSelectDemo from "../components/multi-select-demo";
import SelectDemo from "../components/select-demo";
import UsePaginatedDataDemo from "../components/use-paginated-data-demo";

const DocsPage = () => {
  return (
    <main className="container mx-auto py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Interactive Documentation
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore an interactive documentation of our reusable components with
          examples and detailed guides.
        </p>
      </div>

      <Tabs defaultValue="introduction" className="w-full">
        <TabsList>
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="i18n">Internationalization</TabsTrigger>
          <TabsTrigger value="error">Error Handling</TabsTrigger>
          <TabsTrigger value="global-loader">Global Loader</TabsTrigger>
          <TabsTrigger value="use-paginated-data">usePaginatedData</TabsTrigger>
          <TabsTrigger value="data-display">Data Display</TabsTrigger>
          <TabsTrigger value="button">Buttons</TabsTrigger>
          <TabsTrigger value="form">Form Basics</TabsTrigger>
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="textarea">Textarea</TabsTrigger>
          <TabsTrigger value="select">Select</TabsTrigger>
          <TabsTrigger value="multi-select">Multi-Select</TabsTrigger>
        </TabsList>
        <TabsContent value="introduction" className="mt-6">
          <DemoIntroduction />
        </TabsContent>
        <TabsContent value="i18n">
          <InternationalizationDemo />
        </TabsContent>
        <TabsContent value="error">
          <ErrorDemo />
        </TabsContent>
        <TabsContent value="global-loader">
          <GlobalLoaderDemo />
        </TabsContent>
        <TabsContent value="use-paginated-data">
          <UsePaginatedDataDemo />
        </TabsContent>
        <TabsContent value="data-display">
          <DataDisplayDemo />
        </TabsContent>
        <TabsContent value="button">
          <ButtonDemo />
        </TabsContent>
        <TabsContent value="form">
          <FormDemo />
        </TabsContent>
        <TabsContent value="input">
          <FormInputDemo />
        </TabsContent>
        <TabsContent value="textarea">
          <FormTextareaDemo />
        </TabsContent>
        <TabsContent value="select">
          <SelectDemo />
        </TabsContent>
        <TabsContent value="multi-select">
          <MultiSelectDemo />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default DocsPage;
