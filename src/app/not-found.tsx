import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="text-5xl font-mono font-bold text-[var(--text-muted)]">404</div>
      <p className="text-sm text-[var(--text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
