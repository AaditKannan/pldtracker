"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/depositions", label: "Depositions" },
  { href: "/analyses", label: "Analyses" },
  { href: "/explorer", label: "Data Explorer" },
  { href: "/camera", label: "Positioning" },
];

export default function NavBar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-sm flex items-center px-6 gap-6 shrink-0">
      <Link href="/" className="font-semibold text-sm tracking-tight text-[var(--text-primary)]">
        PLD Tracker
      </Link>
      <div className="flex gap-1 text-sm">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              isActive(link.href)
                ? "text-[var(--text-primary)] bg-[var(--bg-hover)] font-medium"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="ml-auto">
        <Link
          href="/depositions/new"
          className="text-xs bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded-md hover:bg-[var(--accent-primary-hover)] transition-colors font-medium"
        >
          + New Deposition
        </Link>
      </div>
    </nav>
  );
}
