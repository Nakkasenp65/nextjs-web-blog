import Link from "next/link";
import React from "react";
import { TfiWrite } from "react-icons/tfi";

const Footer = () => {
  return (
    <div className="relative flex py-5 px-8 md:px-16 justify-between bottom-0 w-full p-4">
      <div className="flex flex-1 items-center text-inherit gap-2 font-bold text-xl">
        <TfiWrite className="text-3xl sm:text-4xl" /> WriteBlog
      </div>
      <div className="flex justify-end items-center md:flex-1 sm:flex-2 md:gap-4 sm:gap-2 xs:gap-2">
        <Link
          href={"/about"}
          className="ease-in-out duration-300 flex justify-center hover:font-bold py-2 px-4 sm:px-6 rounded-full border border-white "
        >
          About
        </Link>
      </div>
    </div>
  );
};

export default Footer;
