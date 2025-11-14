import * as React from "react";
import { FieldValues, useController } from "react-hook-form";

import { Button } from "../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { Input } from "../shadcn/input";
import { MultiSelect, MultiSelectOption } from "../shadcn/multi-select";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";

interface Option {
  label: string;
  value: string;
}

interface FormMultiSelectProps<TFieldValues extends FieldValues>
  extends Omit<
      React.ComponentProps<typeof MultiSelect>,
      "inputSize" | "label" | "onValueChange" | "defaultValue"
    >,
    FormElementProps<TFieldValues> {
  onCreate?: (newItem: Option) => void;
  createLabel?: string;
}

export const FormMultiSelect = <TFieldValues extends FieldValues>({
  control,
  fieldName,
  inputSize = "md",
  wrapperClassName,
  label,
  labelAction,
  description,
  isRequired,
  hintTooltip,
  options,
  onCreate,
  createLabel = "New Entry", //translation fix
  ...multiSelectProps
}: FormMultiSelectProps<TFieldValues>) => {
  const {
    field: { value, onChange },
  } = useController({ name: fieldName, control });

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newItemLabel, setNewItemLabel] = React.useState("");

  const handleCreate = () => {
    if (newItemLabel.trim() === "") return;
    const newOption = {
      label: newItemLabel,
      value: newItemLabel.toLowerCase().replace(/\s+/g, "-"),
    };
    onCreate?.(newOption);
    setIsDialogOpen(false);
    setNewItemLabel("");
    onChange([...(value ?? []), newOption.value]);
  };

  const mergedOptions: MultiSelectOption[] = [
    ...(options as MultiSelectOption[]), // cast for TypeScript
    { label: `➕ ${createLabel}`, value: "__create_new__" },
  ];

  return (
    <FormElementWrapper
      control={control}
      fieldName={fieldName}
      inputSize={inputSize}
      wrapperClassName={wrapperClassName}
      label={label}
      labelAction={labelAction}
      description={description}
      isRequired={isRequired}
      hintTooltip={hintTooltip}
    >
      <>
        <MultiSelect
          options={mergedOptions}
          defaultValue={value ?? []}
          onValueChange={(vals) => {
            if (vals.includes("__create_new__")) {
              setIsDialogOpen(true);
              onChange(vals.filter((v) => v !== "__create_new__"));
            } else {
              onChange(vals);
            }
          }}
          resetOnDefaultValueChange={true}
          {...multiSelectProps}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{createLabel}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Indtast navn..."
                value={newItemLabel}
                onChange={(e) => {
                  setNewItemLabel(e.target.value);
                }}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                }}
              >
                Annuller
              </Button>
              <Button onClick={handleCreate}>Opret</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </FormElementWrapper>
  );
};
