"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/picker", label: "Picker" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="site-nav">
        {routes.map((route) => {
          const isActive =
            route.href === "/"
              ? pathname === route.href
              : pathname.startsWith(route.href);

          return (
            <li key={route.href}>
              <Link
                href={route.href}
                className={`site-nav__link ${isActive ? "site-nav__link--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {route.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
