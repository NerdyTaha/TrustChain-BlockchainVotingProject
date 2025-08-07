import dbConfig from "@/middlewares/db.config";
import Admin from "@/models/Admin.model";
import Candidate from "@/models/Candidate.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const user = await Candidate.findOne({ email: formData.email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const newUser = new Candidate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      institute: formData.institute,
      role: formData.role,
      profileImage: formData.profileImage,
    });
    console.log(newUser);
    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
