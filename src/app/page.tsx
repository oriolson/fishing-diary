import Link from "next/link";
import { DiaryTimeline } from "@/components/diary-timeline";
import { TodayDiary } from "@/components/today-diary";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 sm:py-10">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between text-sm font-medium text-[color:var(--reed)]">
        <span>Fishing Diary</span>
        <Link
          href="/diary"
          className="rounded-full px-4 py-2 transition hover:bg-[color:var(--paper)] focus:outline-none focus:ring-2 focus:ring-[color:var(--float)]"
        >
          Diary
        </Link>
      </nav>
      <TodayDiary />
      <section className="mx-auto mt-16 w-full max-w-5xl border-t border-[color:var(--reed)]/15 pt-10 sm:mt-24 sm:pt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--float)]">
          The record
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
          Diary
        </h2>
        <DiaryTimeline />
      </section>
    </main>
  );
}
