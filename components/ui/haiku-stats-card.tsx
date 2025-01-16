import { useState } from "react";
import { cn } from "@/lib/utils";
import { HaikuGuess, HaikuStats } from "@prisma/client";

interface HaikuStatsCardProps {
  stats: HaikuStats;
  guesses: HaikuGuess[];
  totalGuesses: number;
}

export function HaikuStatsCard({
  stats,
  guesses,
  totalGuesses,
}: HaikuStatsCardProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "guesses">("stats");

  const calculatePercentage = (count: number) => {
    return totalGuesses > 0 ? Math.round((count / totalGuesses) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <div className="flex border-b mb-4">
        <button
          className={cn(
            "px-4 py-2 font-medium",
            activeTab === "stats"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
        <button
          className={cn(
            "px-4 py-2 font-medium",
            activeTab === "guesses"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab("guesses")}
        >
          Top Guesses
        </button>
      </div>

      {activeTab === "stats" ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">
            Total Guesses: {totalGuesses}
          </p>
          {[
            { label: "First Try", count: stats.firstTryCount },
            { label: "Second Try", count: stats.secondTryCount },
            { label: "Third Try", count: stats.thirdTryCount },
          ].map(({ label, count }) => {
            const percentage = calculatePercentage(count);
            if (percentage === 0) return null;

            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-pink-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {guesses
            .sort((a, b) => {
              // Correct guess always on top
              if (a.isCorrect !== b.isCorrect) return a.isCorrect ? -1 : 1;
              // Then sort by count
              return b.count - a.count;
            })
            .slice(0, 5)
            .map((guess) => {
              const percentage = calculatePercentage(guess.count);
              if (percentage === 0) return null;

              return (
                <div key={guess.movieId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{guess.movieTitle}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        guess.isCorrect ? "bg-blue-400" : "bg-pink-400"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
