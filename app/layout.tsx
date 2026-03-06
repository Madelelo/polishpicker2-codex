import type { Metadata } from "next";
import { SiteNav } from "@/app/site-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolishPicker",
  description: "Explore your polish catalog and find your next mani combo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-shell">
            <strong className="brand">Maddies nail polish closet</strong>
          </div>
        </header>
        <main className="site-shell">{children}</main>
        <footer className="site-footer">
          <div className="site-shell">
            <SiteNav />
          </div>
        </footer>
      </body>
    </html>
  );
}
