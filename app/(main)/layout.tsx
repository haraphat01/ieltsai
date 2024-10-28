import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/sidebar/Sidebarnav";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cartrims",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col sm:flex-row">
          <div className="hidden sm:block border">
            <Sidebar />
          </div>
          <div className="w-full sm:ml-64 h-screen overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
