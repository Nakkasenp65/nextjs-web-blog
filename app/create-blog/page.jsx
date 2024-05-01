"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import demoImage from "@/public/demo_image.jpg";
import Image from "next/image";

const createBlog = () => {
  const initialState = {
    title: "",
    description: "",
    excerpt: "",
    quote: "",
    image: "",
    category: "Tech",
    photo: "",
  };

  const CLOUD_NAME = "dxglnyu4r";
  const UPLOAD_PRESET = "next_blog_images";

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <p>Please login to create blog</p>;

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;
    if (type === "file") setState({ ...state, [name]: files[0] });
    else setState({ ...state, [name]: value });
  };

  //handleChange function

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { photo, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      setError("Please fill out all required fields.");
      return;
    }

    if (photo) {
      const maxSize = 5 * 1024 * 1024;
      if (photo.size > maxSize) {
        setError("FIle size is too large, please select a file under 5MB");
        return;
      }
    }

    if (title.length < 4) {
      setError("Title must be at least 4 characters long.");
      return;
    }

    if (description.length < 20) {
      setError("Description must be at least 20 characters long.");
      return;
    }

    if (excerpt.length < 10) {
      setError("Excerpt must be at least 10 characters long.");
      return;
    }

    if (quote.length < 6) {
      setError("Quote must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      const image = await uploadImage();

      const newBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch("http://localhost:3000/api/blog", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(newBlog),
      });

      if (response?.status === 201) {
        setSuccess("Blog created successfully.");
        setTimeout(() => {
          router.push("/blog");
          router.refresh();
        }, 1500);
      } else {
        setError("Error occurred while creating blog.");
      }
    } catch (error) {
      console.log(error);
      setError("Error occurred while creating blog.");
    }

    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.photo) return;
    const formdata = new FormData();
    formdata.append("file", state.photo);
    formdata.append("upload_preset", UPLOAD_PRESET);

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

  return (
    <section className="container max-w-3xl py-24 ">
      <h2 className="mb-5">
        <span className="special-word">Create</span> Blog
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Write you title here..."
          onChange={handleChange}
          value={state.title}
        />

        <TextArea
          label="Description"
          rows="4"
          name="description"
          placeholder="Write you description here..."
          onChange={handleChange}
          value={state.description}
        />

        <TextArea
          label="Excerpt"
          rows="2"
          name="excerpt"
          placeholder="Write you excerpt here..."
          onChange={handleChange}
          value={state.excerpt}
        />

        <TextArea
          label="Quote"
          rows="2"
          name="quote"
          placeholder="Write you quote here..."
          onChange={handleChange}
          value={state.quote}
        />

        <div>
          <label className="block">Select an option</label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className="block rounded-lg w-full p-3 bg-primaryColorLight"
          >
            <option value="Tech">Tech</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Sports">Sports</option>
            <option value="Health">Health</option>
            <option value="Animals">Animals</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Upload Image</label>

          <input
            onChange={handleChange}
            type="file"
            name="photo"
            accept="image/*"
          />

          {state.photo && (
            <div>
              <Image
                src={URL.createObjectURL(state.photo)}
                priority
                alt="Sample image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-32 mt-5"
              />
            </div>
          )}
        </div>

        {error && <div className="text-red-700">{error}</div>}

        {success && <div className="text-green-700">{success}</div>}

        <button type="submit" className="btn">
          {isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </section>
  );
};

export default createBlog;
