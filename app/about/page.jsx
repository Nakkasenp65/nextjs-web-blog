import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <div className="w-full flex flex-col md:flex md:flex-row md:items-center md:text-end md:h-screen gap-4 p-20 bg-white ">
      <h1 className="text-2xl md:text-4xl md:flex-1 border-stone-600 md:border-r md:pr-5">
        Welcome to Write
        <Link
          href="/blog/"
          className="ease-in-out duration-500 hover:drop-shadow-glow hover:text-7xl special-word"
        >
          Blog
        </Link>
        , your platform for sharing your unique story with the world.
      </h1>

      <p className="text-lg text-start md:flex-3 md:w-2/5">
        "Your voice matters. Start{" "}
        <Link
          href="/blog/"
          className="ease-in-out duration-500 hover:drop-shadow-glow hover:text-2xl hover:bold special-word "
        >
          writing
        </Link>{" "}
        your blog and share your story with the world."{" "}
      </p>
    </div>
  );
};

export default About;
