import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Data } from "../../auth/verifytoken/route";
import dbConfig from "@/middlewares/db.config";
import Institution from "@/models/Institute.model";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json(
      { message: "Token Not Found. Please login again" },
      { status: 500 }
    );
  const data = jwt.verify(token, process.env.JWT_SECRET!) as Data;
  if (!data) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 404 }
    );
  }
  try {
    const institute = await Institution.find({ owner: data.id });
    return NextResponse.json({ institute }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
}
