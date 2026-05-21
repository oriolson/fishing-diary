import Link from "next/link";
import { DiaryTimeline } from "@/components/diary-timeline";

export default function DiaryPage() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 sm:py-10">
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between text-sm font-medium text-[color:var(--reed)]">
        <Link
          href="/"
          className="rounded-full px-4 py-2 transition hover:bg-[color:var(--paper)] focus:outline-none focus:ring-2 focus:ring-[color:var(--float)]"
        >
          Today
        </Link>
        <span>Diary</span>
      </nav>
      <section className="mx-auto mt-14 w-full max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--float)]">
          The record
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-none tracking-[-0.04em] sm:text-7xl">
          Days on the water
        </h1>
        <DiaryTimeline />
      </section>
    </main>
  );
}
