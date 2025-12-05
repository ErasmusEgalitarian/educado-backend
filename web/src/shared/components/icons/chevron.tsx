import React from "react";

import ChevronDown from "@/shared/assets/chevron-down.svg";
import ChevronUp from "@/shared/assets/chevron-up-.svg";

interface ChevronProps {
  open: boolean;
  className?: string;
}

export const Chevron: React.FC<ChevronProps> = ({ open, className }) => {
  return (
    <img
      src={open ? ChevronUp : ChevronDown}
      alt={open ? "Collapse" : "Expand"}
      className={`w-5 h-5 transition-transform duration-200 ${className ?? ""}`}
    />
  );
};
