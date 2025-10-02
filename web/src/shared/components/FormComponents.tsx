import React from "react";

/* Button Component */
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    dissabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = "button",
    className = "",
    dissabled = false,
}) => (
    <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${className}`}
        disabled={dissabled}
    >
        {children}
    </button>
);

/* Textarea Component */
interface TextareaProps{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
};

export const Textarea: React.FC<TextareaProps> = ({
    value,
    onChange,
    placeholder = "",
    className = "",
    rows = 4,
}) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        rows={rows}
    />
);