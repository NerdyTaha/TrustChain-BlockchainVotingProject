import Election from "@/models/Election.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    console.log(formData);
    const election = new Election({
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      institution: formData.instituteName,
      candidates: formData.candidates,
    });
    const winner = formData.candidates.reduce((prev, current) =>
      prev.vote > current.vote ? prev : current
    );
    election.result = winner.candidate._id;
    await election.save();
    return NextResponse.json({ election }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create election" },
      { status: 500 }
    );
  }
}
