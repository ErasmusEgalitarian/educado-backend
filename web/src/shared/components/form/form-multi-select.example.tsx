/**
 * Example usage of FormMultiSelect component
 *
 * This file demonstrates how to use the FormMultiSelect component
 * with react-hook-form in your application.
 */

import { useForm } from "react-hook-form";

import { FormMultiSelect } from "./form-multi-select";

interface ExampleFormData {
  categories: string[];
  tags: string[];
}

export const ExampleFormWithMultiSelect = () => {
  const form = useForm<ExampleFormData>({
    defaultValues: {
      categories: [],
      tags: ["tag1"],
    },
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Basic usage */}
      <FormMultiSelect
        control={form.control}
        fieldName="categories"
        label="Categories"
        description="Select one or more categories"
        isRequired
        options={[
          { label: "Technology", value: "tech" },
          { label: "Science", value: "science" },
          { label: "Arts", value: "arts" },
          { label: "Sports", value: "sports" },
        ]}
      />

      {/* With grouped options */}
      <FormMultiSelect
        control={form.control}
        fieldName="tags"
        label="Tags"
        description="Select relevant tags"
        options={[
          {
            heading: "Popular",
            options: [
              { label: "Trending", value: "tag1" },
              { label: "Featured", value: "tag2" },
            ],
          },
          {
            heading: "Other",
            options: [
              { label: "Archive", value: "tag3" },
              { label: "Draft", value: "tag4" },
            ],
          },
        ]}
        maxCount={5}
        placeholder="Select tags..."
        searchable
      />

      {/* With custom animation and styling */}
      <FormMultiSelect
        control={form.control}
        fieldName="categories"
        label="Advanced Options"
        options={[
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ]}
        animationConfig={{
          badgeAnimation: "bounce",
          popoverAnimation: "scale",
        }}
        variant="secondary"
        maxCount={3}
        closeOnSelect={false}
        responsive
      />

      <button type="submit">Submit</button>
    </form>
  );
}
