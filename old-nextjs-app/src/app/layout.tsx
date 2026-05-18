import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata: Metadata = {
  title: "Student Study Planner",
  description: "A modern full-stack planner for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
