import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

interface IconButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    "aria-label": string;
    disabled?: boolean;
}

function IconButton({
    children,
    onClick,
    className,
    type = "button",
    disabled = false,
    ...props
}: IconButtonProps) {
    return (
        <HeadlessButton
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                "p-2 rounded-md bg-gray-800 text-gray-400 hover:text-green-500 hover:bg-gray-900 cursor-pointer transition",
                "focus:outline-none focus:ring-2 focus:text-green-600 focus:ring-offset-2",
                "disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
        </HeadlessButton>
    );
}

export { IconButton };
