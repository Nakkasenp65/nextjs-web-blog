"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { singOut, useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import Modal from "@/components/Modal";
import { deletePhoto } from "@/actions/uploadActions";
import Input from "@/components/Input";
import demoImage from "@/public/demo_image.png";
import { AiOutlineClose } from "react-icons/ai";

const ProfileDetails = ({ profile, params }) => {
  const CLOUD_NAME = "dxglnyu4r";
  const UPLOAD_PRESET = "next_blog_images";

  const [profileToEdit, setProfileToEdit] = useState(profile);
  const [avatarToEdit, setAvatarToEdit] = useState("");
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, about, designation, age, location } = profileToEdit;

    if (!name) {
      setError("Name required");
      return;
    }

    if (avatarToEdit) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (avatarToEdit.size > maxSize) {
        setError("File size is too large. Please select a file under 2MB.");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      let profileImage;

      if (avatarToEdit) {
        profileImage = await uploadImage();

        if (profile?.avatar?.id) await deletePhoto(profile?.avatar?.id);
      } else {
        profileImage = profile?.avatar;
      }

      const updateUser = {
        name,
        about,
        designation,
        age,
        location,
        avatar: profileImage,
      };

      const response = await fetch(
        `http://localhost:3000/api/user/${params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PATCH",
          body: JSON.stringify(updateUser),
        }
      );

      if (response?.status === 200) {
        setSuccess("User updated successfully.");
      } else {
        setError("Error occurred while updating user.");
      }
    } catch (error) {
      console.log(error);
      setError("Error occurred while updating user.");
    } finally {
      setSuccess("");
      setError("");
      setIsLoading(false);
      setOpenModalEdit(false);
      setAvatarToEdit("");
      router.refresh();
    }
  };

  const uploadImage = async () => {
    if (!avatarToEdit) return;

    const formdata = new FormData();
    console.log(formdata);
    formdata.append("file", avatarToEdit);
    formdata.append("upload_preset", UPLOAD_PRESET);

    console.log(formdata);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await res.json();
      const image = {
        id: data["public_id"],
        url: data["secure_url"],
      };

      return image;
    } catch (error) {
      console.log(error);
    }
  };

  const timeFormat = () => {
    const time = moment(profile?.createdAt);
    const formattedTime = time.format("MMMM Do YYYY");
    return formattedTime;
  };

  const handleCancleUploadImage = () => {};

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setAvatarToEdit(files[0]);
    } else {
      setProfileToEdit((preState) => ({ ...preState, [name]: value }));
    }
  };

  if (!profile) {
    return <p>Access deined.</p>;
  }

  return (
    <div className="container h-fit mt-16 py-16  ">
      <div className="flex flex-col md:flex-row md:justify-center gap-5 md:gap-24 ">
        <div className="md:px-10 md:bg-componentColor md:rounded-2xl">
          <div className="flex-1 space-y-3  p-2 flex flex-col items-center">
            <h4 className="text-3xl">About me</h4>
            <p>{profile?.about}</p>
          </div>

          <div className="flex-1 flex items-center justify-center  px-4 py-10">
            <Image
              src={profile?.avatar?.url || demoImage}
              alt="avat-image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-60 h-60 rounded-full border-2 border-black "
            />
          </div>
        </div>

        <div className="w-full flex-1">
          <div className="flex-1 space-y-3">
            <h4 className="text-xl">Details</h4>

            <div className="space-y-1 cursor-default">
              <p>Email:</p>
              <p className="bg-componentColor py-2 px-6 rounded-xl h-10 w-full">
                {profile?.email}
              </p>
            </div>

            <div className="space-y-1 cursor-default">
              <p>Name:</p>
              <p className="bg-componentColor py-2 px-6 rounded-xl h-10 w-full">
                {profile?.name}
              </p>
            </div>

            <div className="space-y-1 cursor-default">
              <p>Age:</p>
              <p className="bg-componentColor py-2 px-6 rounded-xl h-10 w-full">
                {profile?.age}
              </p>
            </div>

            <div className="space-y-1 cursor-default">
              <p>Location:</p>
              <p className="bg-componentColor py-2 px-6 rounded-xl h-10 w-full">
                {profile?.location}
              </p>
            </div>

            <div className="space-y-1 cursor-default">
              <p>Joined:</p>
              <p className="bg-componentColor py-2 px-6 rounded-xl h-10 w-full">
                {timeFormat()}
              </p>
            </div>
            {profile?._id === session?.user?._id && (
              <button
                className="text-primaryColor mr-3"
                onClick={() => setOpenModalEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-edit pt-5">
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleEditSubmit} className="w-full space-y-3">
            <h2 className="text-2xl text-primaryColor pb-3">Profile</h2>

            {avatarToEdit ? (
              <div className="flex justify-center items-start">
                <Image
                  src={URL.createObjectURL(avatarToEdit)}
                  alt="avatar"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-20 h-20 rounded-full border-2 border-black"
                />
                <button
                  className="text-red-500"
                  onClick={handleCancleUploadImage}
                >
                  <AiOutlineClose />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                {profile?.avatar && profile?.avatar["url"] && (
                  <div>
                    <Image
                      src={profile?.avatar?.url}
                      alt="avatar"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-20 h-20 rounded-full border-2 border-black"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <input
                onChange={handleChange}
                type="file"
                name="newImage"
                accept="image/*"
                className="block w-full border border-gray-300 rounded-lg"
              />
            </div>

            <Input
              name="name"
              type={"text"}
              placeholder={"name"}
              value={profileToEdit?.name || ""}
              onChange={handleChange}
            />
            <Input
              name="designation"
              type={"text"}
              placeholder={"designation"}
              value={profileToEdit?.designation || ""}
              onChange={handleChange}
            />
            <Input
              name="about"
              type={"text"}
              placeholder={"about"}
              value={profileToEdit?.about || ""}
              onChange={handleChange}
            />
            <Input
              name="age"
              type={"text"}
              placeholder={"age"}
              value={profileToEdit?.age || ""}
              onChange={handleChange}
            />
            <Input
              name="location"
              type={"text"}
              placeholder={"location"}
              value={profileToEdit?.location || ""}
              onChange={handleChange}
            />

            {error && <div className="text-red-700">{error}</div>}

            {success && <div className="text-green-700">{success}</div>}

            <div className="space-x-5">
              <button type="submit" className="btn">
                {isLoading ? "Loading..." : "Update"}
              </button>

              <button
                className="btn bg-red-700"
                onClick={() => setOpenModalEdit(false)}
              >
                Cancle
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ProfileDetails;
