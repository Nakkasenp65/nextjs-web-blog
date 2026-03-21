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
