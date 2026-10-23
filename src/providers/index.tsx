"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./authProvider";
import GoogleProvider from "./googleProvider";
import QueryProvider from "./queryProvider";
import { ThemeProvider } from "./themeProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryProvider>
        <GoogleProvider>
          <AuthProvider>{children}</AuthProvider>
        </GoogleProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default Providers;
