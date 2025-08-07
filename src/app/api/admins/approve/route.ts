import Admin from "@/models/Admin.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const isApproved = searchParams.get("isApproved");
  if (!id || !isApproved) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  try {
    const admin = await Admin.findByIdAndUpdate(
      id,
      { isApproved: isApproved },
      { new: true }
    );
    return NextResponse.json({ admin });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to approve admin" },
      { status: 500 }
    );
  }
}
