import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import Institution from "@/models/Institute.model";

dbConfig();

export async function GET(req: NextRequest) {
  try {
    const institute = await Institution.find();
    return NextResponse.json({ institute }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
}
