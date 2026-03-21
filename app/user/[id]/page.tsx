import React from "react";
import ProfileDetails from "./ProfileDetails";
import User from "@/models/User";
import { connect } from "@/lib/db";

async function getUserData(id: string) {
  await connect();
  const user = await User.findById(id).select("-password").lean();
  if (!user) throw new Error("User not found");
  return JSON.parse(JSON.stringify(user));
}

const UserProfile = async ({ params }: { params: { id: string } }) => {
  const profile = await getUserData(params.id);
  return (
    <div>
      <ProfileDetails profile={profile} params={params} />
    </div>
  );
};

export default UserProfile;
