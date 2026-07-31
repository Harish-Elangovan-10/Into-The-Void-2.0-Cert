import { NextResponse } from "next/server";

const GOOGLE_SHEET_ID_SANDBOX = process.env.GOOGLE_SHEET_ID_SANDBOX;

function parseCSV(csvText: string) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  
  let nameIndex = headers.findIndex((h) => h === "name" || (h.includes("name") && !h.includes("team")));
  let emailIndex = headers.findIndex((h) => h.includes("email"));

  if (nameIndex === -1) nameIndex = 1;
  if (emailIndex === -1) emailIndex = 2;

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((cell) => cell.replace(/^"|"$/g, "").trim());

    if (row[emailIndex]) {
      results.push({
        name: row[nameIndex] || "Participant",
        email: row[emailIndex],
        certificateId: "SANDBOX-2026-00000",
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

    if (!GOOGLE_SHEET_ID_SANDBOX) {
      console.error("GOOGLE_SHEET_ID_SANDBOX environment variable is not defined.");
      return NextResponse.json(
        { error: "Server Configuration Error: Google Sheet ID is not configured." },
        { status: 500 }
      );
    }

    const sheetCsvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID_SANDBOX}/export?format=csv`;

    const response = await fetch(sheetCsvUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: "Access Denied: Please ensure your Sandbox Google Sheet sharing setting is set to 'Anyone with the link can view'." },
          { status: 401 }
        );
      }
      throw new Error(`Failed to fetch Google Sheet data for Sandbox (${response.status})`);
    }

    const csvText = await response.text();
    const participants = parseCSV(csvText);

    const lowercaseEmail = email.toLowerCase().trim();
    const attendee = participants.find(
      (p) => p.email.toLowerCase().trim() === lowercaseEmail
    );

    if (!attendee) {
      return NextResponse.json(
        { error: "This email is not registered for Open Sandbox Development Workshop" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      attendee,
    });
  } catch (error) {
    console.error("Error in verify-sandbox-workshop API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
