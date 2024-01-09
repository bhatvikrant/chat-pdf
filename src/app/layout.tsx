import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Navbar from "~/components/custom/Navbar";
import Providers from "~/Providers";
import { Toaster } from "~/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Chat PDF",
  description: "Chat with any PDF",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <Navbar />
          {children}
        </body>
        <Toaster />
      </html>
    </Providers>
  );
}
