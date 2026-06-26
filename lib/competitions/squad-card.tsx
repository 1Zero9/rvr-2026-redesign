import type { CompetitionTeamWithPlayers, Competition } from "./types";

// Satori-compatible React component for squad card image generation.
// Rendered server-side via ImageResponse (next/og).
// All styles must be inline (Satori does not support external CSS).

export function SquadCardTemplate({
  team,
  competition,
}: {
  team: CompetitionTeamWithPlayers;
  competition: Pick<Competition, "name">;
}) {
  const players = team.players.map((p) => p.playerPoolEntry.displayName);

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#0B1F3B",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Diagonal watermark tiling via repeating gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.08,
          transform: "rotate(-30deg) scale(1.5)",
          fontSize: 120,
          fontWeight: 900,
          color: "#FAF8F5",
          letterSpacing: 20,
          userSelect: "none",
          whiteSpace: "pre",
        }}
      >
        RVR    RVR    RVR{"\n"}    RVR    RVR    RVR{"\n"}RVR    RVR    RVR
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#85E320",
          padding: "32px 48px",
          borderBottom: "4px solid #85E320",
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontStyle: "italic",
            color: "#0B1F3B",
            textTransform: "uppercase",
            letterSpacing: -1,
          }}
        >
          {team.name}
        </span>
      </div>

      {/* Player list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "24px 48px",
          gap: 0,
        }}
      >
        {players.map((name, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "18px 24px",
              backgroundColor: i % 2 === 0 ? "#0B1F3B" : "#1A3055",
              borderBottom: "1px solid rgba(184,205,238,0.15)",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#85E320",
                marginRight: 24,
                width: 32,
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: 0.5,
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#85E320",
          padding: "20px 48px",
          borderTop: "4px solid #0B1F3B",
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 900,
            fontStyle: "italic",
            color: "#0B1F3B",
            textTransform: "uppercase",
            maxWidth: 400,
          }}
        >
          {competition.name}
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#0B1F3B",
          }}
        >
          rivervalleyrangers.ie
        </span>
      </div>
    </div>
  );
}
