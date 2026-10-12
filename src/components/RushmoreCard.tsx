"use client";
import { useState } from "react";
import type { PlayerEntry } from "@/lib/pl-players";

type Colors = { primary: string; accent: string; text: string };

export default function RushmoreCard({
  player,
  colors,
}: {
  player: PlayerEntry;
  colors: Colors;
}) {
  const [flipped, setFlipped] = useState(false);

  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const career = player.career ?? [];

  return (
    <div className="text-center">
      <div
        onClick={() => setFlipped((v) => !v)}
        className="w-full aspect-[2/3] cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-md overflow-hidden"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            {player.image_url ? (
              <img
                src={player.image_url}
                alt={player.name}
                className="w-full h-full object-cover object-top bg-pl-purple/5"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl font-bold"
                style={{ background: colors.primary, color: colors.text }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-md flex flex-col p-3 overflow-y-auto"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: colors.primary,
              color: colors.text,
            }}
          >
            <div className="text-xs uppercase tracking-wider opacity-80 mb-2 text-center">
              PL Career
            </div>
            {career.length > 0 ? (
              <ul className="text-[10px] space-y-2 text-left">
                {career.map((spell, i) => (
                  <li key={i}>
                    <div className="font-semibold">
                      {spell.club}
                      {spell.from && (
                        <span className="opacity-70 font-normal">
                          {" "}
                          ({spell.from}
                          {spell.to ? `–${spell.to}` : "–"})
                        </span>
                      )}
                    </div>
                    <div className="opacity-70">
                      {spell.apps != null && <>{spell.apps} apps</>}
                      {spell.goals != null && <> · {spell.goals} goals</>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs opacity-70 text-center">
                Career not available
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm text-pl-purple font-medium">{player.name}</div>
      {player.club && (
        <div className="text-xs text-pl-purple/60">{player.club}</div>
      )}
    </div>
  );
}