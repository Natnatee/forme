import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FORME — Architecture & Interiors",
  description:
    "พื้นที่ที่เข้าใจชีวิต — An architectural editorial concept. Explore considered spaces, natural materials, and a quieter way of living. Demo portfolio only.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
