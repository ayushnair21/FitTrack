import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider"; // <-- Added Import
import "./globals.css";

export const metadata: Metadata = {
  title: "FitTrack | Your Personal Fitness Platform",
  description: "Track your workouts and reach your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required by next-themes
    <html lang="en" suppressHydrationWarning>
      {/* Added dark mode base classes and a smooth transition to the body */}
      <body className="antialiased bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
