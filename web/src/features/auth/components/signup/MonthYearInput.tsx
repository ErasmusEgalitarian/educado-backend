import React, { useState, useRef } from "react";
import { useController } from "react-hook-form";
import { FormLabel } from "@/shared/components/shadcn/form";
import { Input } from "@/shared/components/shadcn/input";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => String(CURRENT_YEAR - i));

interface MonthYearInputProps {
  name: string;
  control: any;
  label?: string;
  labelAction?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isRequired?: boolean;
  wrapperClassName?: string;
}

export const MonthYearInput: React.FC<MonthYearInputProps> = ({
  name,
  control,
  label,
  labelAction,
  placeholder = "Start typing month...",
  disabled = false,
  className = "",
  isRequired = false,
  wrapperClassName,
}) => {
  const { field } = useController({ name, control });
  const [step, setStep] = useState<"month" | "year">("month");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(MONTHS);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setHighlightedIndex(-1);
    if (step === "month") {
      // Only allow valid month names, block numbers and slashes
      value = value.replace(/[^a-zA-Z ]/g, "");
      setMonthInput(value);
      setShowDropdown(true);
      setFilteredOptions(
        MONTHS.filter((m) => m.toLowerCase().startsWith(value.toLowerCase()))
      );
    } else {
      // Only allow 4-digit years from dropdown
      value = value.replace(/[^0-9]/g, "").slice(0, 4);
      setYearInput(value);
      setShowDropdown(true);
      setFilteredOptions(
        YEARS.filter((y) => y.startsWith(value))
      );
    }
      // Save to form if both month and year are filled and valid
      const validMonth = MONTHS.find(m => m.toLowerCase() === (step === "month" ? value.trim().toLowerCase() : monthInput.trim().toLowerCase()));
      const yearVal = step === "year" ? value : yearInput;
      if (validMonth && yearVal.length === 4) {
        field.onChange(`${validMonth} / ${yearVal}`);
      }
  };

  // Handle option select
  const handleOptionSelect = (option: string) => {
    if (step === "month") {
      setMonthInput(option);
      setStep("year");
      setShowDropdown(false);
      setHighlightedIndex(-1);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    } else {
      setYearInput(option);
      setShowDropdown(false);
      setHighlightedIndex(-1);
      field.onChange(`${monthInput} / ${option}`);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
      // Save to form if both month and year are filled and valid
      const validMonth = MONTHS.find(m => m.toLowerCase() === monthInput.trim().toLowerCase());
      if (validMonth && yearInput.length === 4) {
        field.onChange(`${validMonth} / ${yearInput}`);
      }
  };

  // Scroll highlighted item into view when navigating with keyboard or when mouse highlights
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
      if (el) {
        el.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
  }, [highlightedIndex]);

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && filteredOptions.length > 0) {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) => {
          const next = prev + 1;
          return next >= filteredOptions.length ? 0 : next;
        });
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? filteredOptions.length - 1 : next;
        });
        e.preventDefault();
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        handleOptionSelect(filteredOptions[highlightedIndex]);
        e.preventDefault();
      }
    }
    // If in year mode and backspace/delete is pressed in the month part, switch to month editing
    if (step === "year" && inputRef.current) {
      const pos = inputRef.current.selectionStart || 0;
      // If cursor is before or at the slash, or if backspace/delete is pressed at the start
      if ((e.key === "Backspace" || e.key === "Delete") && pos <= monthInput.length + 3) {
        setStep("month");
        setShowDropdown(true);
        setFilteredOptions(MONTHS.filter((m) => m.toLowerCase().startsWith(monthInput.toLowerCase())));
        setHighlightedIndex(-1);
      }
    }
  };

  // Sync local state from field.value
  React.useEffect(() => {
    if (field.value) {
      const [month, year] = String(field.value).split(" / ");
      setMonthInput(month || "");
      setYearInput(year || "");
      setStep(year ? "year" : "month");
    } else {
      setMonthInput("");
      setYearInput("");
      setStep("month");
    }
  }, [field.value]);

  // Only show valid month from list
  const validMonth = MONTHS.find(m => m.toLowerCase() === monthInput.trim().toLowerCase());
  const displayValue = step === "month"
    ? monthInput
    : `${validMonth || ""}${validMonth ? " / " : ""}${yearInput}`;

  return (
    <div className={"relative w-full " + (wrapperClassName ?? "")}>
      {label != null && label !== "" && (
        <div className="flex items-center">
          <FormLabel required={isRequired} inputSize="md">
            {label}
          </FormLabel>
          {labelAction}
        </div>
      )}

      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-required={isRequired}
        className={`block w-full px-3 py-2 border border-greyscale-border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-primary-border-lighter font-['Montserrat'] text-greyscale-text-body ${className}`}
      />

      {showDropdown && (
        <ul ref={listRef} className="absolute left-0 right-0 mt-1 bg-white border border-greyscale-border-lighter rounded-md shadow-lg max-h-40 overflow-y-auto p-0 list-none">
          {filteredOptions.map((option, idx) => (
            <li
              key={option}
              className={`px-3 py-2 cursor-pointer font-['Montserrat'] text-greyscale-text-body ${highlightedIndex === idx ? 'bg-accent text-accent-foreground' : ''} hover:bg-accent hover:text-accent-foreground`}
              onMouseDown={() => handleOptionSelect(option)}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
