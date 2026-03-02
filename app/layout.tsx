import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolishPicker",
  description: "Explore your polish catalog and find your next mani combo."
};

const routes = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/picker", label: "Picker" }
];

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
            <Link className="brand" href="/">
              PolishPicker
            </Link>
            <nav aria-label="Main navigation">
              <ul className="site-nav">
                {routes.map((route) => (
                  <li key={route.href}>
                    <Link href={route.href}>{route.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="site-shell">{children}</main>
      </body>
    </html>
  );
}
