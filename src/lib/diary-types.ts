export type FishCatch = {
  species: string;
  count: number;
};

export type DiaryEntry = {
  id: string;
  date: string;
  caughtFish: boolean;
  fish: FishCatch[];
  note?: string;
  createdAt: string;
};

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}
