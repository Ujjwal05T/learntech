"use client"

import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};

export function ScrollArea({ children, className = "", ...rest }: Props) {
  return (
    <div
      {...rest}
      className={`overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {children}
    </div>
  );
}

export default ScrollArea;
