import type { Metadata } from "next";
import UnauthorizedView from "@/components/modules/unauthorized/UnauthorizedView";

export const metadata: Metadata = {
  title: "Access Restricted — CivicFlow",
  description: "Security clearance required to view this municipal portal resource.",
};

export default function UnauthorizedPage() {
  return <UnauthorizedView />;
}
