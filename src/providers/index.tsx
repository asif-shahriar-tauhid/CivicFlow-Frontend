"use client";

import type { ReactNode } from "react";
import GoogleProvider from "./googleProvider";
import QueryProvider from "./queryProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <GoogleProvider>{children}</GoogleProvider>
    </QueryProvider>
  );
};

export default Providers;
