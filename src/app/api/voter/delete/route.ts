import Voter from "@/models/Voter.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const voterId = searchParams.get("id");
  if (!voterId) {
    return NextResponse.json(
      { message: "Voter ID is required" },
      { status: 400 }
    );
  }
  try {
    await Voter.deleteOne({ _id: voterId });
    return NextResponse.json({ message: "Voter deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete voter" },
      { status: 500 }
    );
  }
}
