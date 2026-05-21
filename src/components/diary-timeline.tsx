"use client";

import { useSyncExternalStore } from "react";
import { getEntries, subscribeToEntries } from "@/lib/diary-storage";
import type { DiaryEntry } from "@/lib/diary-types";

export function DiaryTimeline() {
  const entries = useDiaryEntries();

  if (entries.length === 0) {
    return (
      <div className="mt-10 rounded-[2rem] border border-[color:var(--reed)]/15 bg-[color:var(--paper)] p-8">
        <p className="font-serif text-3xl tracking-[-0.03em]">
          No days logged yet.
        </p>
        <p className="mt-3 max-w-md text-[color:var(--reed)]">
          Start with today. A quiet day still belongs in the diary.
        </p>
      </div>
    );
  }

  return (
    <ol className="mt-10 space-y-4">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="rounded-[1.75rem] border border-[color:var(--reed)]/15 bg-[color:var(--paper)] p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--reed)]">
                {formatDate(entry.date)}
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
                {entry.caughtFish
                  ? describeCatch(entry)
                  : "No fish today"}
              </h2>
            </div>
            <span className="w-fit rounded-full bg-[color:var(--background)] px-3 py-1 text-sm text-[color:var(--reed)]">
              {entry.caughtFish ? "Caught" : "Still counts"}
            </span>
          </div>
          {entry.note ? (
            <p className="mt-4 max-w-2xl text-[color:var(--reed)]">
              {entry.note}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function useDiaryEntries() {
  return useSyncExternalStore(subscribeToEntries, getEntries, getServerEntries);
}

function getServerEntries(): DiaryEntry[] {
  return [];
}

function describeCatch(entry: DiaryEntry) {
  const firstFish = entry.fish[0];

  if (!firstFish) {
    return "Fish caught";
  }

  return `${firstFish.count} ${firstFish.species}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}
