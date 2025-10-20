import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import CategoryCreateNew from "@/course/components/category-create-modal";
import { Form } from "@/shared/components/shadcn/form";

import { ApiCourseCategoryCourseCategoryDocument } from "./shared/api";
import { FormMultiSelect } from "./shared/components/form/form-multi-select";
import {
  MultiSelectOption,
  MultiSelectRef,
} from "./shared/components/shadcn/multi-select";

// The zod schema defines both validation and the form's data shape.
const formSchema = z.object({
  elements: z.array(z.string()),
});

const TestPage2 = () => {
  const multiInputRef = React.useRef<MultiSelectRef>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Use React Hook Form and Zod to manage the form state and validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      elements: undefined,
    },
    mode: "onTouched", // Only validate when the user has interacted
  });

  // Submit handler. Data shape can be inferred from the schema.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Wait 2 seconds to simulate a network request and to see "submitting..."
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Submitted values: " + JSON.stringify(values));
  }

  const handleCategoryCreated = (
    data: ApiCourseCategoryCourseCategoryDocument
  ) => {
    const newOption: MultiSelectOption = {
      label: data.name,
      value: data.documentId,
    };

    if (!multiInputRef.current) {
      console.error(
        "multiInputRef is null - ref may not be properly forwarded"
      );
      return;
    }

    multiInputRef.current.addOption(newOption, true);
    setIsModalOpen(false);
  };

  return (
    <div className="w-2xl mx-auto mt-10 flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8"
        >
          <FormMultiSelect
            ref={multiInputRef}
            fieldName="elements"
            control={form.control}
            options={[
              { label: "Fire", value: "fire" },
              { label: "Water", value: "water" },
            ]}
            onCreateClick={() => {
              setIsModalOpen(true);
            }}
          />
        </form>
      </Form>
      <CategoryCreateNew
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onCreated={handleCategoryCreated}
      />
    </div>
  );
};

export default TestPage2;
