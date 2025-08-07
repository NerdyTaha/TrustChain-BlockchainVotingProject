import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Data } from "../auth/verifytoken/route";
import Institution from "@/models/Institute.model";
import Candidate from "@/models/Candidate.model";
import dbConfig from "@/middlewares/db.config";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = jwt.verify(token, process.env.JWT_SECRET!) as Data;
  if (data.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const institute = await Institution.find({ owner: data.id });
    var candidates = [];
    for (let i = 0; i < institute.length; i++) {
      const candidate = await Candidate.find({
        institute: institute[i]._id,
      }).populate("institute");
      candidates.push(...candidate);
    }
    return NextResponse.json({ candidates }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
}
