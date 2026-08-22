// Root layout — minimal shell. The <html> tag with lang/dir lives in app/[lang]/layout.tsx.
import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmarStore | Modern Online Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Direct bare-path visitors are redirected by middleware.ts to /en or /ar
  return <>{children}</>;
}
