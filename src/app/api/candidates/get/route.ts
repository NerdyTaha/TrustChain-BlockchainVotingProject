import Candidate from "@/models/Candidate.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "At least one id is required" },
      { status: 400 }
    );
  }

  try {
    const candidate = await Candidate.findById(id).populate("institute");
    return NextResponse.json({ candidate }, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { message: "Failed to fetch candidate details" },
      { status: 500 }
    );
  }
}
