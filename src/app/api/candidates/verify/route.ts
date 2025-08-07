import dbConfig from "@/middlewares/db.config";
import Candidate from "@/models/Candidate.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  const { id, candidate, status } = await req.json();
  if (!id || !candidate || status === undefined) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
  try {
    const exisitingCandidate = await Candidate.findById(id);
    if (!exisitingCandidate) {
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }
    exisitingCandidate.isApproved = status;
    await exisitingCandidate.save();
    return NextResponse.json({ message: "Candidate updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
