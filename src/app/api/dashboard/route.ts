import Candidate from "@/models/Candidate.model";
import Election from "@/models/Election.model";
import Institution from "@/models/Institute.model";
import Voter from "@/models/Voter.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const totalVoters = await Voter.countDocuments();
    const totalInstitutions = await Institution.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalElections = await Election.countDocuments();
    return NextResponse.json(
      {
        totalVoters,
        totalInstitutions,
        totalCandidates,
        totalElections,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
