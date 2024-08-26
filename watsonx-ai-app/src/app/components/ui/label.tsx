import React from 'react';
import { cn } from "@/lib/utils"

interface LabelProps {
    htmlFor: string;
    className?: string;
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, className, children }) => {
    return (
        <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-gray-700", className)}>
            {children}
        </label>
    );
};

export default Label;