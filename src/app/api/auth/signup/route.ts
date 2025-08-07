import dbConfig from "@/middlewares/db.config";
import Admin from "@/models/Admin.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const user = await Admin.findOne({ email: formData.email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    // Encrypt Password
    const encryptedPassword = await bcrypt.hash(formData.password, 10);
    // Create New User
    const newUser = new Admin({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: encryptedPassword,
      role: "admin",
      isApproved: false,
      profileImage: formData.profileImage,
    });
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
