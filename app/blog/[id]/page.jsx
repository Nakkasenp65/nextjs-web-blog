"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deletePhoto } from "@/actions/uploadActions";

import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import demoImage from "@/public/demo_image.png";
import noImage from "@/public/no-image.jpg";
import Input from "@/components/Input";
import EditButton from "@/components/EditButton";

import {
  AiFillDelete,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BsFillPencilFill, BsTrash } from "react-icons/bs";

function splitParagraph(paragraph) {
  const MIN_LENGTH = 280;
  const sentences = paragraph.split(". ");

  let currentParagraph = "";
  let paragraphs = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const isLastSentence = i === sentences.length - 1;

    if (isLastSentence) {
      currentParagraph += sentence + " "; // No dot after the last sentence
    } else if (currentParagraph.length + sentence.length + 2 <= MIN_LENGTH) {
      currentParagraph += sentence + ". ";
    } else {
      paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
      currentParagraph = sentence + ". ";
    }
  }

  if (currentParagraph) {
    paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
  }

  return paragraphs;
}

const BlogDetails = ({ params }) => {
  const [blogDetails, setBlogDetails] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [blogComments, setBlogComments] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  //login session
  const { data: session, status } = useSession();

  async function fetchBlog() {
    try {
      const res = await fetch(`http://localhost:3000/api/blog/${params.id}`);
      const blog = await res.json();
      setBlogDetails(blog);
      setIsLiked(blog?.likes?.includes(session?.user?._id));
      setBlogLikes(blog?.likes?.length || 0);
      setBlogComments(blog?.comments?.length || 0);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, []);

  const timeStr = blogDetails?.createdAt;
  const time = moment(timeStr);
  const formattedTime = time.format("MMMM Do YYYY");

  const handleBlogDelete = async (imageId) => {
    try {
      const confirmModal = window.confirm(
        "Are you sure you want to delete your blog?"
      );

      if (confirmModal) {
        setIsDeleting(true);
        const res = await fetch(`http://localhost:3000/api/blog/${params.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });

        if (res?.status === 200) {
          await deletePhoto(imageId);
          router.refresh();
          router.push("/blog");
        }
      }

      setIsDeleting(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    if (!session?.user) {
      alert("Please login to like the blog");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/blog/${params.id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(null),
        }
      );

      if (res.status === 200) {
        setIsLiked((prev) => !prev);
        setBlogLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      } else {
        console.log("Response failed, status:", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText) {
      setError("comment text is required.");
      return;
    }

    try {
      setIsCommenting(true);
      setError("");

      const newComment = {
        text: commentText,
      };

      const res = await fetch(
        `http://localhost:3000/api/blog/${params.id}/comment`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify(newComment),
        }
      );

      if (res?.status === 201) {
        setSuccess("Comment created successfully.");
        setTimeout(() => {
          setCommentText("");
          fetchBlog();
        }, 500);
      } else {
        setError("Error occurred while creating comment.");
      }
    } catch (error) {
      console.log(error);
      setError("Error occurred while creating comment.");
    }

    setIsCommenting(false);
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/blog/${params.id}/comment/${commentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "DELETE",
        }
      );

      if (res.status === 200) {
        fetchBlog();
      } else {
        console.log("Requested failed with status", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="container max-w-3xl ">
      {/* edit and delete icon rendered for the author  */}
      {blogDetails?.authorId?._id.toString() ===
        session?.user?._id.toString() && (
        <div className="flex items-center justify-end gap-5">
          <EditButton id={params.id} />

          <button
            onClick={() => handleBlogDelete(blogDetails?.image?.id)}
            className="flex items-center gap-1 text-red-500"
          >
            <BsTrash />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <Link href={`/user/${blogDetails?.authorId?._id.toString()}`}>
          <div className="flex flex-col justify-center items-center py-10">
            <Image
              src={
                blogDetails?.authorId?.avatar?.url
                  ? blogDetails?.authorId?.avatar?.url
                  : demoImage
              }
              alt=""
              sizes={"100vw"}
              width={0}
              height={0}
              className="w-20 h-20 rounded-full"
            />

            <div className="text-center">
              <p className="text-whiteColor">{blogDetails?.authorId?.name}</p>
              <p>{blogDetails?.authorId?.designation}</p>
            </div>
          </div>
        </Link>

        <div className="text-center space-y-3">
          <h2>{blogDetails?.title}</h2>
          <p>{blogDetails?.excerpt}...</p>
          <p className="flex item-center justify-center gap-3">
            <span className="text-primaryColor">{blogDetails?.category}</span>
            <span className="flex items-center gap-1">
              <AiTwotoneCalendar />
              {formattedTime}
            </span>
          </p>

          <div>
            <Image
              src={blogDetails?.image ? blogDetails?.image?.url : noImage}
              alt="blog-details-image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full rounded-xl py-10"
            />
          </div>

          <div className="text-start">
            <div className="space-y-5">
              {blogDetails?.description &&
                splitParagraph(blogDetails?.description).map(
                  (paragraph, pIndex) => (
                    <div key={pIndex}>
                      {pIndex ===
                        Math.floor(
                          splitParagraph(blogDetails?.description).length / 2
                        ) && (
                        <blockquote className="border-l-4 border-primaryColor border-spacing-6 italic mb-5">
                          <p className="ml-5">{blogDetails?.quote}</p>
                        </blockquote>
                      )}

                      {paragraph}
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="flex gap-10 items-center text-xl justify-center">
          <div className="flex items-center gap-1">
            <p>{blogLikes}</p>
            {isLiked ? (
              <AiFillHeart
                onClick={handleLike}
                size={20}
                color="#ed5784"
                cursor="pointer"
              />
            ) : (
              <AiOutlineHeart onClick={handleLike} size={20} cursor="pointer" />
            )}
          </div>

          <div className="flex items-center gap-1">
            <p>{blogComments}</p>

            <AiOutlineComment size={20} />
          </div>
        </div>
      </div>

      <div>
        {!session?.user && (
          <h3 className="text-red-400 font-extralight text-xs">
            kindly login to leave a comment.
          </h3>
        )}

        {session?.user && (
          <form onSubmit={handleCommentSubmit} className="space-y-2">
            <Input
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
              name="comment"
              type="text"
              placeholder="Type message"
            />
            <button type="submit" className="btn">
              {isCommenting ? "Loading..." : "Comment"}
            </button>
          </form>
        )}

        {blogDetails?.comments && blogDetails?.comments.length === 0 && (
          <p>no comments</p>
        )}

        {blogDetails?.comments && blogDetails?.comments.length > 0 && (
          <>
            {blogDetails.comments.map((c) => (
              <div key={c._id} className="flex gap-3 py-5 items-center">
                <Image
                  src={c?.user?.avatar?.url ? c?.user?.avatar?.url : demoImage}
                  alt="avatar "
                  width={0}
                  height={0}
                  sizes={"100vw"}
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <p className="text-whiteColor">{c?.user?.name}</p>
                  <p>{c.text}</p>
                </div>

                {session?.user?._id === c?.user?._id && (
                  <BsTrash
                    onClick={() => handleCommentDelete(c._id)}
                    cursor="pointer"
                    className="text-red-500 ml-10"
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogDetails;
