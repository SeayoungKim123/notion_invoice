type StarRatingProps = {
  rating: string;
  size?: "sm" | "lg";
  showScore?: boolean;
};

export default function StarRating({
  rating,
  size = "sm",
  showScore = false,
}: StarRatingProps) {
  const match = rating.match(/(\d)/);
  const score = match ? parseInt(match[1], 10) : 0;

  if (score === 0) return null;

  const sizeClass = size === "lg" ? "text-xl" : "text-sm";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < score
              ? `${sizeClass} text-yellow-400`
              : `${sizeClass} text-muted-foreground`
          }
        >
          ★
        </span>
      ))}
      {showScore && (
        <span className="text-muted-foreground ml-1 text-sm">{score} / 5</span>
      )}
    </div>
  );
}
