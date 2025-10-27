import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavWrapper from "@/components/Navbar/NavWrapper";
import { Toaster } from "@/components/ui/sonner"





const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banking Review System",
  description: "Banking Review System With Nextjs 15.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        <NavWrapper/>
        {children}
        <Toaster position="top-center"/>
      </body>
    </html>

  );
}
