"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./authProvider";
import GoogleProvider from "./googleProvider";
import QueryProvider from "./queryProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <GoogleProvider>
        <AuthProvider>{children}</AuthProvider>
      </GoogleProvider>
    </QueryProvider>
  );
};

export default Providers;
