"use client";

import type { ReactNode } from "react";
import QueryProvider from "./queryProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Providers;
