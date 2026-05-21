import type { DiaryEntry } from "@/lib/diary-types";

const STORAGE_KEY = "fishing-diary.entries";
const STORAGE_EVENT = "fishing-diary.entries.changed";
const EMPTY_ENTRIES: DiaryEntry[] = [];
let cachedStoredValue: string | null = null;
let cachedEntries: DiaryEntry[] = EMPTY_ENTRIES;

export function getEntries(): DiaryEntry[] {
  if (typeof window === "undefined") {
    return EMPTY_ENTRIES;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    cachedStoredValue = null;
    cachedEntries = EMPTY_ENTRIES;
    return EMPTY_ENTRIES;
  }

  if (storedValue === cachedStoredValue) {
    return cachedEntries;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as DiaryEntry[];
    const sortedEntries = parsedValue.sort((a, b) =>
      b.date.localeCompare(a.date),
    );

    cachedStoredValue = storedValue;
    cachedEntries = sortedEntries;

    return sortedEntries;
  } catch (error) {
    console.warn("Could not read fishing diary entries.", error);
    return EMPTY_ENTRIES;
  }
}

export function getServerEntries(): DiaryEntry[] {
  return EMPTY_ENTRIES;
}

export function saveEntry(entry: DiaryEntry) {
  const entries = getEntries().filter((item) => item.date !== entry.date);
  const nextEntries = [entry, ...entries].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const storedValue = JSON.stringify(nextEntries);

  cachedStoredValue = storedValue;
  cachedEntries = nextEntries;

  window.localStorage.setItem(STORAGE_KEY, storedValue);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function subscribeToEntries(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}
