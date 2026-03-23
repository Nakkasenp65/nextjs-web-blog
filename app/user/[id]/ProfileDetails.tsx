"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Camera, 
  X,
  Loader2,
  Heart,
  MessageSquare
} from "lucide-react";

import Modal from "@/components/Modal";
import { deletePhoto } from "@/actions/uploadActions";
import Input from "@/components/Input";
import demoImage from "@/public/demo_image.png";

import { useUpdateUser } from "@/hooks/mutations/useUserMutations";

const ProfileDetails = ({ profile, params }: { profile: any; params: { id: string } }) => {
  const [profileToEdit, setProfileToEdit] = useState(profile);
  const [avatarToEdit, setAvatarToEdit] = useState<File | "">("");
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: session }: any = useSession();
  const router = useRouter();

  const updateUserMutation = useUpdateUser();

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { name, about, designation, age, location } = profileToEdit;

    if (!name) {
      setError("Name is required");
      return;
    }

    if (avatarToEdit && avatarToEdit instanceof File) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (avatarToEdit.size > maxSize) {
        setError("Image size must be under 2MB.");
        return;
      }
    }

    try {
      setError("");
      setSuccess("");

      let profileImage;

      if (avatarToEdit && avatarToEdit instanceof File) {
        const formdata = new FormData();
        formdata.append("file", avatarToEdit);
        const { uploadPhoto } = await import("@/actions/uploadActions");
        profileImage = await uploadPhoto(formdata);

        if (profile?.avatar?.id) await deletePhoto(profile?.avatar?.id);
      } else {
        profileImage = profile?.avatar;
      }

      const updateUserData = {
        name,
        about,
        designation,
        age,
        location,
        avatar: profileImage,
      };

      updateUserMutation.mutate(
        { id: params.id, data: updateUserData },
        {
          onSuccess: () => {
            setSuccess("Profile updated successfully!");
            setTimeout(() => setOpenModalEdit(false), 1500);
          },
          onError: () => setError("Failed to update profile.")
        }
      );
    } catch (error) {
      console.log(error);
      setError("Failed to update profile.");
    } finally {
      setAvatarToEdit("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError("");
    const { name, value, type } = event.target as any;

    if (type === "file") {
      const files = (event.target as HTMLInputElement).files;
      if (files) setAvatarToEdit(files[0]);
    } else {
      setProfileToEdit((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const isOwnProfile = session?.user?._id === profile?._id;

  return (
    <div className="container py-24 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glassmorphism rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-colors" />
            
            <div className="relative w-48 h-48 mx-auto mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-full h-full rounded-full border-4 border-background shadow-2xl overflow-hidden relative"
              >
                <Image
                  src={profile?.avatar?.url || demoImage}
                  alt={profile?.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
              {isOwnProfile && (
                <button 
                  onClick={() => setOpenModalEdit(true)}
                  className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            <h1 className="text-3xl font-black tracking-tight mb-2">{profile?.name}</h1>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
              {profile?.designation || "Content Creator"}
            </p>
            
            <div className="flex justify-center gap-6 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-lg font-bold">12</p>
                <p className="text-xs text-muted-foreground uppercase">Blogs</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">1.2k</p>
                <p className="text-xs text-muted-foreground uppercase">Likes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">84</p>
                <p className="text-xs text-muted-foreground uppercase">Comments</p>
              </div>
            </div>
          </div>

          <div className="glassmorphism rounded-[2rem] p-8 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-bold truncate">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-bold">{profile?.location || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-bold">{formatDate(profile?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glassmorphism rounded-[2.5rem] p-10 min-h-[300px] relative">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl font-black tracking-tight italic text-primary">About me</h2>
              {isOwnProfile && (
                <button
                  onClick={() => setOpenModalEdit(true)}
                  className="flex items-center gap-2 text-sm font-bold bg-muted hover:bg-primary hover:text-white px-4 py-2 rounded-full transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {profile?.about || "This storyteller is still crafting their bio. Check back soon for more details about their journey and inspirations."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glassmorphism rounded-3xl p-8 hover:border-primary/50 transition-colors group">
              <Heart className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold mb-2 tracking-tight">Community Impact</h4>
              <p className="text-sm">Active contributor and supporter within the WriteBlog ecosystem.</p>
            </div>
            <div className="glassmorphism rounded-3xl p-8 hover:border-primary/50 transition-colors group">
              <MessageSquare className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold mb-2 tracking-tight">Active Discussions</h4>
              <p className="text-sm">Consistently engaging in conversations and sharing insights.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2">Update Profile</h2>
            <p className="text-sm text-muted-foreground italic">Keep your story up to date</p>
          </div>

          <div className="relative w-32 h-32 mx-auto group">
            <div className="w-full h-full rounded-full border-4 border-primary shadow-xl overflow-hidden">
              <Image
                src={avatarToEdit instanceof File ? URL.createObjectURL(avatarToEdit) : profile?.avatar?.url || demoImage}
                alt="avatar"
                fill
                className="object-cover"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
              <Camera className="w-8 h-8 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                className="hidden" 
              />
            </label>
            <AnimatePresence>
              {avatarToEdit && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => setAvatarToEdit("")}
                  className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest ml-1">Full Name</label>
              <Input
                name="name"
                type="text"
                placeholder="Your name"
                value={profileToEdit?.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest ml-1">Designation</label>
              <Input
                name="designation"
                type="text"
                placeholder="e.g. Software Engineer"
                value={profileToEdit?.designation || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest ml-1">Age</label>
              <Input
                name="age"
                type="text"
                placeholder="Your age"
                value={profileToEdit?.age || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest ml-1">Location</label>
              <Input
                name="location"
                type="text"
                placeholder="City, Country"
                value={profileToEdit?.location || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest ml-1">About Me</label>
            <textarea
              name="about"
              rows={4}
              placeholder="Tell your story..."
              value={profileToEdit?.about || ""}
              onChange={handleChange}
              className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-red-500 text-xs font-bold text-center"
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-green-500 text-xs font-bold text-center"
            >
              {success}
            </motion.p>
          )}

          <div className="flex gap-4 pt-2">
            <button
              disabled={updateUserMutation.isPending}
              type="submit"
              className="flex-1 btn-primary disabled:opacity-50 h-12 rounded-2xl flex items-center justify-center"
            >
              {updateUserMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setOpenModalEdit(false)}
              className="flex-1 btn bg-muted hover:bg-muted/80 h-12 rounded-2xl font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfileDetails;
