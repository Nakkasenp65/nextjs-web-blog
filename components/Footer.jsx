import Link from "next/link";
import React from "react";
import { TfiWrite } from "react-icons/tfi";

const Footer = () => {
  return (
    <div className="flex relative py-5 md:px-16 sm:px-8 justify-between bottom-0 w-full p-4">
      <div className="flex  flex-1 items-center text-inherit gap-2">
        <TfiWrite className="text-2xl" /> WriteBlog
      </div>
      <div className="flex justify-end items-center md:flex-1 sm:flex-2 md:gap-4 sm:gap-2 xs:gap-2">
        <Link
          href={"/contact"}
          className="ease-in-out duration-300 flex justify-center rounded-full border border-white border-transparent hover:font-bold shadow-glow 
          lg:p-2 lg:w-24 md:w-24 md:p-1 sm:p-1 sm:text-sm sm:w-20 xs:w-16 xs:text-sm xs:p-1 xs:border-none "
        >
          Contact
        </Link>
        <Link
          href={"/about"}
          className="ease-in-out duration-300 flex justify-center rounded-full border border-white border-transparent hover:font-bold shadow-glow 
          lg:p-2 lg:w-24 md:w-24 md:p-1 sm:p-1 sm:text-sm sm:w-20 xs:w-16 xs:text-sm xs:p-1 xs:border-none "
        >
          About
        </Link>
      </div>
    </div>
  );
};

export default Footer;
