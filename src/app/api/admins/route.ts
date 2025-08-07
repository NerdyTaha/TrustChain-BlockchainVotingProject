import dbConfig from "@/middlewares/db.config";
import Admin from "@/models/Admin.model";
import { NextResponse } from "next/server";

dbConfig();

export async function GET() {
  try {
    const admins = await Admin.find();
    return NextResponse.json({ admins });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}
