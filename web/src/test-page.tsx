import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useFileUpload } from "@/shared/hooks/use-file-upload";

import { FormFileUpload } from "./shared/components/form/form-file-upload";

import { Form } from "@/shared/components/shadcn/form";

import FormActions from "./shared/components/form/form-actions";
import { FileWithMetadataSchema } from "./shared/components/file-upload";

import GenericModalComponent from "./shared/components/GenericModalComponent";
import { SearchBar } from "./shared/components/SearchBar";

// The zod schema defines both validation and the form's data shape.
const formSchema = z.object({
  image: z.array(FileWithMetadataSchema).optional(),
});

const TestPage = () => {
  const { uploadFile } = useFileUpload();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalItems = 123;
  // Use React Hook Form and Zod to manage the form state and validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
    mode: "onTouched", // Only validate when the user has interacted
  });

  // Submit handler. Data shape can be inferred from the schema.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (values.image == undefined) {
      return;
    }
    const ids = await uploadFile(values.image);
    console.log("ids: " + ids);

    // Wait 2 seconds to simulate a network request and to see "submitting..."
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Submitted values: " + JSON.stringify(values));
  }

  const sortingOptions = [
    { displayName: "Newest first", htmlValue: "newest" },
    { displayName: "Oldest first", htmlValue: "oldest" },
    { displayName: "Name (A–Z)", htmlValue: "az" },
  ];

  return (
    <div className="w-2xl mx-auto mt-10 flex flex-col gap-4">
      {/* Search bar */}
      <SearchBar
        sortingOptions={sortingOptions}
        placeholderText="Search for files..."
        searchFn={(term) => {
          console.log("Search term:", term);
          setSearchQuery(term);
        }}
      />
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8"
        >
          <FormFileUpload name="image" control={form.control} />
          <FormActions
            formState={form.formState}
            showReset={true}
            onReset={() => {
              form.reset();
            }}
          />
        </form>
      </Form>

    

      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary mt-6"
      >
        Open Modal
      </button>

      <GenericModalComponent
        isVisible={isModalOpen}
        title="Modal Test"
        contentText="Dette er en testmodal – du kan lukke den med (X) eller knappen herunder."
        cancelBtnText="Luk"
        confirmBtnText="Bekræft"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          toast.success("Bekræftet!");
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default TestPage;
