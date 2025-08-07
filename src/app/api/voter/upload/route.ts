import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as xlsx from "xlsx";
import dbConfig from "@/middlewares/db.config";
import Voter from "@/models/Voter.model";

dbConfig();

const excelDateToJSDate = (serial: number | string): string => {
  if (typeof serial === "number") {
    const excelEpoch = new Date(1900, 0, 1);
    return new Date(excelEpoch.getTime() + (serial - 1) * 86400000)
      .toISOString()
      .split("T")[0];
  }
  return serial;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }
  try {
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const voters = await Promise.all(
      sheetData.map(async (row: any) => {
        const hashedPassword = await bcrypt.hash(row.password, 10);
        return {
          epicId: row.epicid,
          name: row.name,
          email: row.email,
          phone: row.phone.toString(),
          profileImage: row.profileImage,
          dob: excelDateToJSDate(row.dob),
          address: {
            address: row.address,
            district: row.district,
            taluka: row.taluka,
            state: row.state,
            country: row.country,
            pincode: row.pincode.toString(),
          },
          password: hashedPassword,
        };
      })
    );
    await Voter.insertMany(voters);
    return NextResponse.json(
      { message: `${voters.length} no. of voters/voter added!!` },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
