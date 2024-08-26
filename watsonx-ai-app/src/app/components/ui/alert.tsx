import React from 'react';
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: 'default' | 'destructive';x: any
  className?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'default', className, children, ...props }) => {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === 'destructive' && "border-red-500 bg-red-50 text-red-700",
        variant === 'default' && "border-gray-200 bg-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h5
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
);

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
);