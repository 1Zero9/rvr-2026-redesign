import type { ParsedPlayerRow } from "./types";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const XLSX = require("xlsx") as typeof import("xlsx");

const NAME_KEYWORDS = ["first", "last", "name", "firstname", "lastname", "fullname", "full name"];
const AGE_KEYWORDS = ["age", "agegroup", "age group", "year", "dob"];
const CLUB_KEYWORDS = ["club", "school", "team", "organisation", "organization"];
const NOTES_KEYWORDS = ["note", "notes", "comment", "comments", "info"];
const DAYS_KEYWORDS = ["day", "days", "available", "availability", "session"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip fada
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function matchesKeyword(header: string, keywords: string[]): boolean {
  const n = normalize(header);
  return keywords.some((kw) => n.includes(normalize(kw)));
}

function detectColumns(headers: string[]): {
  firstNameCol: number;
  lastNameCol: number;
  fullNameCol: number;
  ageCol: number;
  clubCol: number;
  notesCol: number;
  daysCol: number;
} {
  let firstNameCol = -1, lastNameCol = -1, fullNameCol = -1;
  let ageCol = -1, clubCol = -1, notesCol = -1, daysCol = -1;

  headers.forEach((h, i) => {
    const n = normalize(h);
    if (n.includes("first") && (n.includes("name") || firstNameCol === -1)) firstNameCol = i;
    else if (n.includes("last") && n.includes("name")) lastNameCol = i;
    else if ((n === "name" || n.includes("full")) && !n.includes("team")) fullNameCol = i;
    if (ageCol === -1 && matchesKeyword(h, AGE_KEYWORDS)) ageCol = i;
    if (clubCol === -1 && matchesKeyword(h, CLUB_KEYWORDS)) clubCol = i;
    if (notesCol === -1 && matchesKeyword(h, NOTES_KEYWORDS)) notesCol = i;
    if (daysCol === -1 && matchesKeyword(h, DAYS_KEYWORDS)) daysCol = i;
  });

  return { firstNameCol, lastNameCol, fullNameCol, ageCol, clubCol, notesCol, daysCol };
}

function makeDisplayName(first: string, last: string): string {
  const lastInitial = last.trim().charAt(0).toUpperCase();
  return `${first.trim()} ${lastInitial}.`;
}

export async function parseUpload(
  buffer: Buffer,
  filename: string,
  competitionAgeGroup?: string,
): Promise<ParsedPlayerRow[]> {
  const isCSV = filename.toLowerCase().endsWith(".csv");
  const workbook = isCSV
    ? XLSX.read(buffer.toString("utf-8"), { type: "string" })
    : XLSX.read(buffer, { type: "buffer" });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows: string[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as string[][];

  if (rawRows.length < 2) return [];

  // Strip BOM from first header cell
  if (rawRows[0][0]) {
    rawRows[0][0] = rawRows[0][0].replace(/^﻿/, "");
  }

  const headers = rawRows[0].map((h) => String(h));
  const cols = detectColumns(headers);
  const seenNames = new Set<string>();
  const results: ParsedPlayerRow[] = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (row.every((c) => !String(c).trim())) continue;

    const flags: string[] = [];
    let firstName = "";
    let lastName = "";

    if (cols.fullNameCol !== -1 && cols.firstNameCol === -1) {
      const full = String(row[cols.fullNameCol] ?? "").trim();
      const parts = full.split(/\s+/);
      firstName = parts[0] ?? "";
      lastName = parts.slice(1).join(" ");
    } else {
      firstName = cols.firstNameCol !== -1 ? String(row[cols.firstNameCol] ?? "").trim() : "";
      lastName = cols.lastNameCol !== -1 ? String(row[cols.lastNameCol] ?? "").trim() : "";
    }

    if (!firstName) {
      flags.push("Missing first name — row skipped from assignment");
    }

    const key = `${normalize(firstName)}|${normalize(lastName)}`;
    if (seenNames.has(key) && firstName) {
      flags.push("Probable duplicate — same name in this batch");
    }
    seenNames.add(key);

    const ageGroup = cols.ageCol !== -1 ? String(row[cols.ageCol] ?? "").trim() : undefined;
    if (
      ageGroup &&
      competitionAgeGroup &&
      normalize(ageGroup) !== normalize(competitionAgeGroup)
    ) {
      flags.push(`Age group mismatch: player is "${ageGroup}", competition is "${competitionAgeGroup}"`);
    }

    const clubOrSchool = cols.clubCol !== -1 ? String(row[cols.clubCol] ?? "").trim() || undefined : undefined;
    const notes = cols.notesCol !== -1 ? String(row[cols.notesCol] ?? "").trim() || undefined : undefined;
    const daysRaw = cols.daysCol !== -1 ? String(row[cols.daysCol] ?? "").trim() : "";
    const availableDays = daysRaw ? daysRaw.split(/[,;]/).map((d) => d.trim()).filter(Boolean) : [];

    results.push({
      firstName,
      lastName,
      displayName: firstName ? makeDisplayName(firstName, lastName || "?") : "",
      ageGroup: ageGroup || undefined,
      clubOrSchool,
      notes,
      availableDays,
      flags,
    });
  }

  return results;
}
