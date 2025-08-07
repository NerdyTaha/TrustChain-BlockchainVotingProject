import Institution from "@/models/Institute.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Please provide an id" },
      { status: 400 }
    );
  }
  try {
    await Institution.findByIdAndDelete(id);
    return NextResponse.json({ message: "Institution deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
