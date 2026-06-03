export function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <span className="inline-flex items-center gap-2">
      <b className="w-7 tabular-nums">{score}</b>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-[#0b1220]">
        <i
          className="block h-full"
          style={{ width: `${score}%`, background: color }}
        />
      </span>
    </span>
  );
}
