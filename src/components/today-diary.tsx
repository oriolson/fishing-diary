"use client";

import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BobberScene } from "@/components/bobber-scene";
import { getEntries, saveEntry, subscribeToEntries } from "@/lib/diary-storage";
import { todayKey } from "@/lib/diary-types";
import type { DiaryEntry } from "@/lib/diary-types";

type CatchChoice = "caught" | "none" | null;

export function TodayDiary() {
  const today = useMemo(() => todayKey(), []);
  const todayEntry = useTodayEntry(today);
  const [choice, setChoice] = useState<CatchChoice>(null);
  const [species, setSpecies] = useState("");
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");
  const [tug, setTug] = useState(false);
  const [catchSuccessId, setCatchSuccessId] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!choice) {
      return;
    }

    const nextEntry: DiaryEntry = {
      id: today,
      date: today,
      caughtFish: choice === "caught",
      fish:
        choice === "caught"
          ? [{ species: species.trim() || "fish", count: Math.max(1, count) }]
          : [],
      note: note.trim() || undefined,
      createdAt: todayEntry?.createdAt ?? new Date().toISOString(),
    };

    saveEntry(nextEntry);
    setTug(true);
    window.setTimeout(() => setTug(false), 800);

    if (choice === "caught") {
      setCatchSuccessId((currentId) => currentId + 1);
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-10 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--float)]">
          {formatToday(today)}
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-6xl leading-[0.9] tracking-[-0.06em] sm:text-8xl">
          What came home from the water?
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[color:var(--reed)]">
          Log today in under a minute. Fish or no fish, the day gets a mark.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[color:var(--reed)]/15 bg-[color:var(--paper)] p-4 shadow-[0_24px_80px_color-mix(in_oklch,var(--mud)_12%,transparent)] sm:p-5"
      >
        <BobberScene tug={tug} />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ChoiceButton
            active={choice === "caught"}
            onClick={() => setChoice("caught")}
          >
            Caught fish
          </ChoiceButton>
          <ChoiceButton
            active={choice === "none"}
            onClick={() => setChoice("none")}
          >
            No fish
          </ChoiceButton>
        </div>

        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            choice === "caught" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid gap-3 pt-5 sm:grid-cols-[1fr_7rem]">
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--reed)]">
                  Fish
                </span>
                <input
                  value={species}
                  onChange={(event) => setSpecies(event.target.value)}
                  placeholder="Trout"
                  className="mt-2 w-full rounded-2xl border border-[color:var(--reed)]/20 bg-[color:var(--background)] px-4 py-3 outline-none transition focus:border-[color:var(--float)]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--reed)]">
                  Count
                </span>
                <input
                  value={count}
                  min={1}
                  onChange={(event) => setCount(Number(event.target.value))}
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-[color:var(--reed)]/20 bg-[color:var(--background)] px-4 py-3 outline-none transition focus:border-[color:var(--float)]"
                />
              </label>
            </div>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-[color:var(--reed)]">
            Note
          </span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Cold morning. Water was glassy."
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-[color:var(--reed)]/20 bg-[color:var(--background)] px-4 py-3 outline-none transition focus:border-[color:var(--float)]"
          />
        </label>

        <div className="relative mt-5">
          <button
            type="submit"
            disabled={!choice}
            className="w-full rounded-full bg-[color:var(--foreground)] px-5 py-4 font-semibold text-[color:var(--background)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save today
          </button>
          {catchSuccessId > 0 ? (
            <div
              key={catchSuccessId}
              aria-hidden
              className="pointer-events-none absolute inset-0"
            >
              <span className="catch-success-text absolute inset-x-0 -top-8 text-center text-sm font-semibold text-[color:var(--float)]">
                Nice catch!
              </span>
              <span className="catch-spark catch-spark-left absolute left-1/2 top-1/2" />
              <span className="catch-spark catch-spark-center absolute left-1/2 top-1/2" />
              <span className="catch-spark catch-spark-right absolute left-1/2 top-1/2" />
            </div>
          ) : null}
        </div>

        {todayEntry ? (
          <p className="mt-4 text-center text-sm text-[color:var(--reed)]">
            Saved.{" "}
            <Link className="font-semibold underline" href="/diary">
              View diary
            </Link>
          </p>
        ) : null}
      </form>
    </section>
  );
}

function useTodayEntry(today: string) {
  return useSyncExternalStore(
    subscribeToEntries,
    () => getEntries().find((entry) => entry.date === today) ?? null,
    () => null,
  );
}

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 font-semibold transition ${
        active
          ? "translate-y-[1px] border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
          : "border-[color:var(--reed)]/20 bg-[color:var(--background)] text-[color:var(--foreground)] hover:border-[color:var(--reed)]/45"
      }`}
    >
      {children}
    </button>
  );
}

function formatToday(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}
