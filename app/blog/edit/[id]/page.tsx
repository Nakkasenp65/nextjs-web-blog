"use client";

import React, { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import Image from "next/image";
import { deletePhoto } from "@/actions/uploadActions";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Tech",
  photo: {} as any,
  blogId: "",
  newImage: "" as File | "",
};

import { useGetBlogById } from "@/hooks/queries/useGetBlogById";
import { useUpdateBlog } from "@/hooks/mutations/useBlogMutations";

const EditBlog = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  const [state, setState] = useState(initialState);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { data: session, status }: any = useSession();

  const { data: blogData, isLoading: isBlogLoading } = useGetBlogById(params.id);
  const updateBlogMutation = useUpdateBlog();

  useEffect(() => {
    if (blogData) {
      setState((prevstate) => ({
        ...prevstate,
        title: blogData.title,
        description: blogData.description,
        excerpt: blogData.excerpt,
        quote: blogData.quote,
        category: blogData.category,
        photo: blogData.image,
        blogId: blogData._id as string,
      }));
    }
  }, [blogData]);

  if (status === "loading" || isBlogLoading) {
    return <h2>loading...</h2>;
  }

  if (status === "unauthenticated") {
    return <h2>Access denied</h2>;
  }

  const handleChange = (event: any) => {
    setError("");
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { newImage, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      setError("Please fill out all required fields.");
      return;
    }

    if (newImage && newImage instanceof File) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (newImage.size > maxSize) {
        setError("File size is too large. Please select a file under 5MB.");
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
      setError("");
      setSuccess("");

      let image;

      if (state.newImage && state.newImage instanceof File) {
        image = await uploadImage();

        if (state.photo?.id) await deletePhoto(state.photo.id);
      } else {
        image = state.photo;
      }

      const updateBlogData = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      updateBlogMutation.mutate(
        { id: params.id, data: updateBlogData },
        {
          onSuccess: () => {
            setSuccess("Blog updated successfully.");
            setTimeout(() => {
              router.push(`/blog/${params.id}`);
            }, 1500);
          },
          onError: () => setError("Error occurred while updating blog.")
        }
      );
    } catch (error) {
      console.log(error);
      setError("Error occurred while updating blog.");
    }
  };

  const uploadImage = async () => {
    if (!state.newImage || !(state.newImage instanceof File)) return null;

    const formdata = new FormData();
    formdata.append("file", state.newImage);

    try {
      const { uploadPhoto } = await import("@/actions/uploadActions");
      const image = await uploadPhoto(formdata);
      return image;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleCancleUploadImg = () => {
    setState({ ...state, ["newImage"]: "" });
  };

  return (
    <section className="container max-w-3xl mt-12">
      <h2 className="mb-5">
        <span className="special-word">Edit</span> Blog
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
          rows={4}
          name="description"
          placeholder="Write you description here..."
          onChange={handleChange}
          value={state.description}
        />

        <TextArea
          label="Excerpt"
          rows={2}
          name="excerpt"
          placeholder="Write you excerpt here..."
          onChange={handleChange}
          value={state.excerpt}
        />

        <TextArea
          label="Quote"
          rows={2}
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
            name="newImage"
            accept="image/*"
          />

          {state.newImage && state.newImage instanceof File ? (
            <div>
              <Image
                src={URL.createObjectURL(state.newImage)}
                priority
                alt="Sample image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-32 mt-5"
              />

              <button type="button" onClick={handleCancleUploadImg}>Cancle</button>
            </div>
          ) : (
            <div>
              {state.photo && state.photo["url"] && (
                <div>
                  <Image
                    src={state.photo.url}
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
          )}
        </div>

        {error && <div className="text-red-700">{error}</div>}

        {success && <div className="text-green-700">{success}</div>}

        <button type="submit" disabled={updateBlogMutation.isPending} className="btn">
          {updateBlogMutation.isPending ? "Loading..." : "Edit"}
        </button>
      </form>
    </section>
  );
};

export default EditBlog;
