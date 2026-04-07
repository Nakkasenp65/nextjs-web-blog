"use client";
import React, { useState, use, useEffect } from "react";
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
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BsTrash } from "react-icons/bs";

import { useGetBlogById } from "@/hooks/queries/useGetBlogById";
import { useLikeBlog, useAddComment, useDeleteComment, useDeleteBlog } from "@/hooks/mutations/useBlogMutations";
import { incrementViews } from "@/actions/blogActions";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { Eye } from "lucide-react";
import { BLUR_PLACEHOLDER } from "@/lib/constants";

const BlogDetailsClient = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: session }: any = useSession();

  const { data: blogDetails, isLoading: isBlogLoading } = useGetBlogById(id);
  const likeMutation = useLikeBlog();
  const commentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();
  const deleteBlogMutation = useDeleteBlog();

  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      incrementViews(id);
    }
  }, [id]);

  if (isBlogLoading) return <div className="container max-w-3xl mt-12 text-center">Loading...</div>;
  if (!blogDetails) return <div className="container max-w-3xl mt-12 text-center">Blog not found.</div>;

  const timeStr = blogDetails?.createdAt;
  const time = moment(timeStr);
  const formattedTime = time.format("MMMM Do YYYY");

  const handleBlogDelete = async (imageId?: string) => {
    const confirmModal = window.confirm("Are you sure you want to delete your blog?");
    if (confirmModal) {
      deleteBlogMutation.mutate(id, {
        onSuccess: async () => {
          if (imageId) await deletePhoto(imageId);
          router.push("/blog");
        }
      });
    }
  };

  const handleLike = () => {
    if (!session?.user) {
      alert("Please login to like the blog");
      return;
    }
    likeMutation.mutate({ blogId: id, userId: session.user._id });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText) {
      setError("comment text is required.");
      return;
    }

    setError("");
    commentMutation.mutate(
      { blogId: id, userId: session.user._id, text: commentText },
      {
        onSuccess: () => {
          setSuccess("Comment created successfully.");
          setCommentText("");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: () => setError("Error occurred while creating comment.")
      }
    );
  };

  const handleCommentDelete = (commentId: string) => {
    deleteCommentMutation.mutate({ blogId: id, commentId });
  };

  const isAuthor = (blogDetails?.authorId as any)?._id?.toString() === session?.user?._id?.toString();

  return (
    <section className="container max-w-3xl mt-12 ">
      {isAuthor && (
        <div className="flex items-center justify-end gap-5">
          <EditButton id={id} />

          <button
            onClick={() => handleBlogDelete(blogDetails?.image?.id)}
            disabled={deleteBlogMutation.isPending}
            className="flex items-center gap-1 text-red-500 disabled:opacity-50"
          >
            <BsTrash />
            {deleteBlogMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        {(blogDetails?.authorId as any)?._id && (
          <Link href={`/user/${(blogDetails?.authorId as any)?._id.toString()}`}>
            <div className="flex flex-col justify-center items-center py-10">
              <Image
                src={
                  (blogDetails?.authorId as any)?.avatar?.url
                    ? (blogDetails?.authorId as any)?.avatar?.url
                    : demoImage
                }
                alt=""
                sizes={"100vw"}
                width={0}
                height={0}
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                className="w-20 h-20 rounded-full"
              />

              <div className="text-center">
                <p className="text-whiteColor">{(blogDetails?.authorId as any)?.name}</p>
                <p>{(blogDetails?.authorId as any)?.designation}</p>
              </div>
            </div>
          </Link>
        )}

        <div className="text-center space-y-3">
          <h2>{blogDetails?.title}</h2>
          <p>{blogDetails?.excerpt}...</p>
          <p className="flex item-center justify-center gap-3">
            <span className=" text-primaryColor">{blogDetails?.category}</span>
            <span className="flex items-center gap-1">
              <AiTwotoneCalendar />
              {formattedTime}
            </span>
          </p>

          {blogDetails?.image ? (
            <>
              <Image
                src={blogDetails?.image?.url || noImage}
                alt="blog-details-image"
                width={0}
                height={0}
                sizes="100vw"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                className="w-full h-full rounded-xl py-10"
              />
            </>
          ) : (
            <></>
          )}

          <div className="text-start">
            <div className="space-y-8">
              {blogDetails?.quote && (
                <blockquote className="border-l-4 border-primaryColor border-spacing-6 italic my-8 bg-muted/20 p-6 rounded-r-2xl">
                  <p className="ml-5 text-xl font-medium leading-relaxed">"{blogDetails?.quote}"</p>
                </blockquote>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-2xl">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeHighlight]}
                >
                  {blogDetails?.description || ""}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="flex gap-10 items-center text-xl justify-center">
          <div className="flex items-center gap-2 group transition-colors">
            <Eye size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="text-base font-bold">{blogDetails?.views || 0}</p>
          </div>

          <div className="flex items-center gap-1">
            <p className="text-base font-bold">{blogDetails?.likes?.length || 0}</p>
            {blogDetails?.likes?.includes(session?.user?._id) ? (
              <AiFillHeart
                onClick={handleLike}
                size={20}
                color="#ed5784"
                cursor="pointer"
                className="hover:scale-110 transition-transform"
              />
            ) : (
              <AiOutlineHeart 
                onClick={handleLike} 
                size={20} 
                cursor="pointer" 
                className="hover:scale-110 transition-transform hover:text-[#ed5784]"
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            <p className="text-base font-bold">{blogDetails?.comments?.length || 0}</p>
            <AiOutlineComment size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="comment-form">
        {!session?.user && (
          <h3 className="text-primaryColor font-extralight text-xs">
            kindly login to leave a comment.
          </h3>
        )}

        {session?.user && (
          <form
            onSubmit={handleCommentSubmit}
            className="flex justify-between items-center gap-4"
          >
            <Input
              onChange={(e: any) => setCommentText(e.target.value)}
              value={commentText}
              name="comment"
              type="text"
              label=""
              placeholder="Type message"
            />
            <button
              type="submit"
              disabled={commentMutation.isPending}
              className="text-white bg-primaryColor px-3 py-3 rounded-xl disabled:opacity-50"
            >
              {commentMutation.isPending ? "Loading..." : "Comment"}
            </button>
          </form>
        )}

        {blogDetails?.comments && blogDetails?.comments.length === 0 && (
          <h2 className="pt-12 text-center">no comments...</h2>
        )}

        {blogDetails?.comments && blogDetails?.comments.length > 0 && (
          <>
            {blogDetails.comments.map((c: any) => (
              <div
                key={c._id}
                className="flex gap-3 py-5 items-center  justify-between"
              >
                <div className="user-comment flex gap-5">
                  <Image
                    src={
                      c?.user?.avatar?.url ? c?.user?.avatar?.url : demoImage
                    }
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
                </div>

                {session?.user?._id === c?.user?._id && (
                  <BsTrash
                    onClick={() => handleCommentDelete(c._id)}
                    cursor="pointer"
                    className="text-red-500 ml-10 "
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

export default BlogDetailsClient;
