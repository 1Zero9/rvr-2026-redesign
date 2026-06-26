import { TeamTheme } from "@prisma/client";

export const THEME_POOLS: Record<TeamTheme, string[]> = {
  COUNTRIES: [
    "Ireland", "England", "France", "Spain", "Brazil", "Germany", "Argentina",
    "Portugal", "Italy", "Netherlands", "Belgium", "Croatia", "Japan", "Senegal",
    "Morocco", "Australia", "Jamaica", "Cape Verde", "Ghana", "Colombia",
    "Mexico", "USA", "Denmark", "Switzerland",
  ],
  PREMIER_LEAGUE: [
    "Arsenal", "Chelsea", "Liverpool", "City", "United", "Spurs", "Newcastle",
    "Villa", "Brighton", "West Ham", "Wolves", "Everton", "Fulham", "Brentford",
    "Palace", "Bournemouth", "Forest", "Leicester", "Southampton", "Ipswich",
    "Leeds", "Burnley", "Sheffield", "Luton",
  ],
  LOI_CLUBS: [
    "Shamrock Rovers", "Bohemians", "Dundalk", "Shelbourne", "St Patricks",
    "Drogheda", "Derry City", "Sligo Rovers", "Waterford", "Cork City",
    "Galway United", "UCD", "Finn Harps", "Longford", "Athlone", "Wexford",
    "Treaty United", "Cobh Ramblers", "Bray Wanderers", "Cabinteely",
    "Limerick", "Bohemians B", "Shelbourne B", "UCD B",
  ],
  LEGENDS: [
    "Ronaldo", "Messi", "Zidane", "Pele", "Maradona", "Cruyff", "Beckham",
    "Henry", "Vieira", "Cantona", "Keane", "Giggs", "Scholes", "Gerrard",
    "Lampard", "Terry", "Ferdinand", "Sheringham", "Shearer", "Owen",
    "Fowler", "Cole", "Yorke", "Solskjaer",
  ],
  COLOURS: [
    "Red", "Blue", "Gold", "Silver", "Green", "Yellow", "Orange", "Purple",
    "Black", "White", "Pink", "Teal", "Maroon", "Navy", "Amber", "Jade",
    "Crimson", "Violet", "Coral", "Lime", "Tan", "Copper", "Rust", "Sky",
  ],
  ANIMALS: [
    "Lions", "Eagles", "Wolves", "Tigers", "Bears", "Foxes", "Hawks",
    "Sharks", "Panthers", "Falcons", "Stallions", "Cobras", "Ravens",
    "Jaguars", "Rhinos", "Vipers", "Bulldogs", "Mustangs", "Hornets", "Stingers",
    "Cobras", "Dolphins", "Cheetahs", "Leopards",
  ],
  CUSTOM: [],
};

export function getThemeNames(
  theme: TeamTheme,
  customNames: string[],
  count: number,
): string[] {
  const pool = theme === TeamTheme.CUSTOM ? customNames : THEME_POOLS[theme];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
