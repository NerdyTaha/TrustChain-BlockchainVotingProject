import Election from "@/models/Election.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const elections = await Election.find()
      .populate("institution")
      .populate("result")
      .populate({
        path: "candidates.candidate",
      });
    console.log(elections);
    return NextResponse.json(
      { message: "Election Fetched", elections },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!!" },
      { status: 500 }
    );
  }
}
