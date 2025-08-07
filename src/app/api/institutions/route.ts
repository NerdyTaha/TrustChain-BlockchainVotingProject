import dbConfig from "@/middlewares/db.config";
import Institution from "@/models/Institute.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { name, user } = await req.json();
  if (!name || !user) {
    return NextResponse.json(
      { message: "All Fields are required" },
      { status: 401 }
    );
  }
  try {
    const newInstitute = new Institution({
      name: name,
      owner: user.id,
    });
    await newInstitute.save();
    return NextResponse.json(
      { message: "Institute added successfullly" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
