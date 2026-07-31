import { NextResponse } from "next/server";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;

function parseCSV(csvText: string) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  
  let teamIndex = headers.findIndex((h) => h.includes("team"));
  let nameIndex = headers.findIndex((h) => h === "name" || (h.includes("name") && !h.includes("team")));
  let emailIndex = headers.findIndex((h) => h.includes("email"));

  if (teamIndex === -1) teamIndex = 0;
  if (nameIndex === -1) nameIndex = 1;
  if (emailIndex === -1) emailIndex = 2;

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((cell) => cell.replace(/^"|"$/g, "").trim());

    if (row[emailIndex]) {
      results.push({
        teamName: row[teamIndex] || "Participant",
        name: row[nameIndex] || "Participant",
        email: row[emailIndex],
        eventRole: "Participant",
        certificateId: "VOID-2.0-00000",
      });
    }
  }
  return results;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!GOOGLE_SHEET_ID) {
      console.error("GOOGLE_SHEET_ID environment variable is not defined.");
      return NextResponse.json(
        { error: "Server Configuration Error: Google Sheet ID is not configured." },
        { status: 500 }
      );
    }

    const sheetCsvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;

    // Fetch live data from Google Sheet CSV (no-store ensures real-time updates)
    const response = await fetch(sheetCsvUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: "Access Denied: Please ensure your Into the Void Google Sheet sharing setting is set to 'Anyone with the link can view'." },
          { status: 401 }
        );
      }
      throw new Error(`Failed to fetch Google Sheet data (${response.status})`);
    }

    const csvText = await response.text();
    const participants = parseCSV(csvText);

    const lowercaseEmail = email.toLowerCase().trim();
    const participant = participants.find(
      (p) => p.email.toLowerCase().trim() === lowercaseEmail
    );

    if (!participant) {
      return NextResponse.json(
        { error: "This email is not registered for Into the Void 2.0" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participant,
    });
  } catch (error) {
    console.error("Error in verify API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
