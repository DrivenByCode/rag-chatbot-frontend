import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  className,
                                                  ...props
                                              }) => (
    <button
        className={`px-4 py-2 rounded-lg font-bold bg-blue-500 text-white hover:bg-blue-600 transition ${className}`}
        {...props}
    >
        {children}
    </button>
);
