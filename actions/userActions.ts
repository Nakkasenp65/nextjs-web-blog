"use server";

import { connect } from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateUser(id: string, data: any) {
  await connect();
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).lean();
  revalidatePath(`/user/${id}`);
  return JSON.parse(JSON.stringify(updatedUser));
}

export async function getUserById(id: string) {
  await connect();
  const user = await User.findById(id).select("-password").lean();
  return JSON.parse(JSON.stringify(user));
}
