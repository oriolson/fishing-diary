type BobberSceneProps = {
  tug?: boolean;
};

export function BobberScene({ tug = false }: BobberSceneProps) {
  return (
    <div className="relative h-52 overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--water)_22%,var(--paper)),color-mix(in_oklch,var(--water)_52%,var(--paper)))]">
      <div className="absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-[color:var(--mud)]/50" />
      <div
        className={`bobber absolute left-1/2 top-20 -ml-4 h-12 w-8 overflow-hidden rounded-full border border-[color:var(--mud)]/35 bg-[color:var(--paper)] shadow-sm ${
          tug ? "bobber-tug" : ""
        }`}
      >
        <div className="h-1/2 bg-[color:var(--float)]" />
      </div>
      <div className="ripple absolute left-1/2 top-[7.2rem] h-16 w-32 -translate-x-1/2 rounded-[999px] border border-[color:var(--paper)]/75" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(180deg,transparent,color-mix(in_oklch,var(--reed)_18%,var(--water)))]" />
    </div>
  );
}
