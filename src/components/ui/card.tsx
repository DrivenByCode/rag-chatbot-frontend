import React from "react";

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export const Card: React.FC<CardProps> = ({children, className}) => (
    <div className={`rounded-lg shadow-lg bg-white ${className}`}>{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({
                                                                         children
                                                                     }) => <div className="p-4">{children}</div>;
