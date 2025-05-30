// http://localhost:3000/api/user/someid

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import User from "@/models/User";

export async function PATCH(req, res) {
  await connect();
  const id = res.params.id;
  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];
  const decodedToken = verifyJwtToken(token);

  if (!accessToken || !decodedToken) {
    return NextResponse.json(
      { error: "unauthorized (wrong or expired token)" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const user = await User.findById(id);

    if (user?._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only author can update his/her data" },
        { status: 403 }
      );
    }

    const updateUser = await User.findByIdAndUpdate(user?._id, body, {
      new: true,
    });

    return NextResponse.json(updateUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "PATCH error" }, { status: 500 });
  }
}

export async function GET(req, res) {
  await connect();
  const id = res.params.id;
  try {
    const user = await User.findById(id).select("-password -__v");
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "GET error" },
      {
        status: 500,
      }
    );
  }
}
