import bcrypt from "bcryptjs";
import Admin from "@/models/Admin.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import Voter from "@/models/Voter.model";
import Candidate from "@/models/Candidate.model";

dbConfig();

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  if (!formData.email || !formData.password) {
    return NextResponse.json(
      { message: "Please fill all the fields" },
      { status: 400 }
    );
  }
  if (
    formData.email === "admin@trustchain.com" &&
    formData.password === "Admin@123"
  ) {
    const data = {
      id: "admin",
      email: "admin@trustchain.com",
      role: "super-admin",
      name: "Super Admin",
      profileImage:
        "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
      isApproved: true,
    };
    const token = jwt.sign(data, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const response = NextResponse.json({
      message: "Login successful",
      route: "/super-admin/dashboard",
      token,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });
    return response;
  }
  try {
    if (formData.role === "admin") {
      const admin = await Admin.findOne({ email: formData.email });
      if (!admin) {
        return NextResponse.json(
          { message: "Admin not found" },
          { status: 404 }
        );
      }
      const isValid = bcrypt.compareSync(formData.password, admin.password);
      if (!isValid) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }
      const data = {
        id: admin.id,
        name: admin.name,
        profileImage: admin.profileImage,
        email: admin.email,
        role: admin.role,
        isApproved: admin.isApproved,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      const response = NextResponse.json({
        message: "Login successful",
        route: "/admin/dashboard",
        token,
      });
      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });
      return response;
    }
    if (formData.role === "voter") {
      const voter = await Voter.findOne({ email: formData.email });
      if (!voter) {
        return NextResponse.json(
          { message: "Voter not found" },
          { status: 404 }
        );
      }
      const isValid = bcrypt.compareSync(formData.password, voter.password);
      if (!isValid) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }
      const data = {
        id: voter.id,
        name: voter.name,
        profileImage: voter.profileImage,
        email: voter.email,
        role: "voter",
        isApproved: true,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      const response = NextResponse.json({
        message: "Login successful",
        route: "/voter/dashboard",
        token,
      });
      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });
      return response;
    }
    if (formData.role === "candidate") {
      const candidate = await Candidate.findOne({ email: formData.email });
      if (!candidate) {
        return NextResponse.json(
          { message: "Candidate not found" },
          { status: 404 }
        );
      }
      const isValid = bcrypt.compareSync(formData.password, candidate.password);
      if (!isValid) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }
      const data = {
        id: candidate.id,
        name: candidate.name,
        profileImage: candidate.profileImage,
        email: candidate.email,
        role: "candidate",
        isApproved: candidate.isApproved,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      const response = NextResponse.json({
        message: "Login successful",
        route: "/candidate/dashboard",
        token,
      });
      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });
      return response;
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while creating account" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Something went wrong!!" },
    { status: 500 }
  );
}
