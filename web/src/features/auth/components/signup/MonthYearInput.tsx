import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { FormInput } from "@/shared/components/form/form-input";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => String(CURRENT_YEAR - i));

interface MonthYearInputProps {
  name: string;
  control: any;
  label?: string;
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
  placeholder = "Mês / Ano",
  disabled = false,
  className = "",
  isRequired = false,
  wrapperClassName,
}) => {
  const { setValue, getValues, trigger } = useFormContext();

  const [step, setStep] = useState<"month" | "year">("month");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(MONTHS);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const updateFormValue = (month: string, year: string) => {
    const trimmedMonth = month.trim();
    const trimmedYear = year.trim();

    const validMonth = MONTHS.find(
      (m) => m.toLowerCase() === trimmedMonth.toLowerCase()
    );

    // user fully cleared the field
    if (trimmedMonth === "" && trimmedYear === "") {
      setValue(name, "", {
        shouldValidate: true,
        shouldTouch: true,
      });
      void trigger(name);
      return;
    }

    if (validMonth !== undefined && trimmedYear.length === 4) {
      setValue(name, `${validMonth} / ${trimmedYear}`, {
        shouldValidate: true,
        shouldTouch: true,
      });
      void trigger(name);
    }
  };

  // Handle input change (this controls the visible text)
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
      setFilteredOptions(YEARS.filter((y) => y.startsWith(value)));
    }
  };

  const handleOptionSelect = (option: string) => {
    if (step === "month") {
      setMonthInput(option);
      setStep("year");
      setShowDropdown(false);
      setHighlightedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setYearInput(option);
      setShowDropdown(false);
      setHighlightedIndex(-1);
      updateFormValue(monthInput, option); // month + year → now we sync form
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 100);
    updateFormValue(monthInput, yearInput);
  };

  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as
        | HTMLElement
        | undefined;
      el?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [highlightedIndex]);

  React.useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const target = event.target as Node;
      if (!containerRef.current.contains(target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      step === "year" &&
      yearInput.length === 0 && // nothing typed in year yet
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      e.preventDefault();
      setStep("month");
      setShowDropdown(false);
      return;
    }

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
  };

  // Sync local display state from form value (e.g. reset, prefill)
  React.useEffect(() => {
    const formValue: unknown = getValues(name);
    if (typeof formValue === "string" && formValue.trim().length > 0) {
      const [m, y] = formValue.split(" / ");
      setMonthInput(m || "");
      setYearInput(y || "");
      setStep(y ? "year" : "month");
    } else {
      setMonthInput("");
      setYearInput("");
      setStep("month");
    }
  }, [getValues, name]);

  const validMonth = MONTHS.find(
    (m) => m.toLowerCase() === monthInput.trim().toLowerCase()
  );
  const displayValue =
    step === "month"
      ? monthInput
      : `${validMonth || ""}${validMonth ? " / " : ""}${yearInput}`;

  return (
    <div
      ref={containerRef}
      className={"relative w-full " + (wrapperClassName ?? "")}
    >
      <FormInput
        fieldName={name}
        control={control}
        label={label}
        isRequired={isRequired}
        type="text"
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full px-3 py-2 border border-greyscale-border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-primary-border-lighter font-['Montserrat'] text-greyscale-text-body ${className}`}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef as any}
      />

      {showDropdown && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 mt-1 bg-white border border-greyscale-border-lighter rounded-md shadow-lg max-h-40 overflow-y-auto p-0 list-none z-10"
        >
          {filteredOptions.map((option, idx) => (
            <li
              key={option}
              className={`px-3 py-2 cursor-pointer font-['Montserrat'] text-greyscale-text-body ${
                highlightedIndex === idx
                  ? "bg-accent text-accent-foreground"
                  : ""
              } hover:bg-accent hover:text-accent-foreground`}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus on the input
                handleOptionSelect(option);
              }}
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
