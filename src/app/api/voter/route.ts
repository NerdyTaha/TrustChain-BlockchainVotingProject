import Voter from "@/models/Voter.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const voters = await Voter.find();
    return NextResponse.json({ voters }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch voters" },
      { status: 500 }
    );
  }
}
