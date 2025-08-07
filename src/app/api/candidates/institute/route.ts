import Candidate from "@/models/Candidate.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const serachParams = req.nextUrl.searchParams;
  const id = serachParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Insititute ID is required" },
      { status: 400 }
    );
  }
  try {
    const candidates = await Candidate.find({ institute: id });
    return NextResponse.json({ candidates }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
