import React from "react";
import FirstBlog from "@/components/FirstBlog";
import OtherBlogs from "@/components/OtherBlogs";

async function fetchBlogs() {
  const res = await fetch("http://localhost:3000/api/blog", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const CreateBlog = async () => {
  const blogs = await fetchBlogs();
  const firstBlog = blogs && blogs[0];
  const otherBlogs = blogs?.length > 0 && blogs.slice(1);

  return (
    <div className="mt-28">
      {blogs?.length > 0 ? (
        <>
          <h1 className="px-20">What's new</h1>
          <FirstBlog firstBlog={firstBlog} />
          <div className="w-full flex justify-center ">
            <div className="mx-20 w-full my-10  border-b border-stone-700"></div>
          </div>
          <h1 className="px-20">Other blogs</h1>
          <OtherBlogs otherBlogs={otherBlogs} />
        </>
      ) : (
        <h3>No Blogs...</h3>
      )}
    </div>
  );
};

export default CreateBlog;
