"use server";

import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { UserSignupSchema } from "@/validations";

export async function signupUser(data: any) {
  await connect();

  const parsed = UserSignupSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { name, email, password } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true, user: JSON.parse(JSON.stringify(newUser)) };
}
