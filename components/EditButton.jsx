"use client";
import React from "react";
import { BsFillPencilFill } from "react-icons/bs";
import Link from "next/link";

const EditButton = ({ id }) => {
  return (
    <Link
      href={`/blog/edit/${id}`}
      className="flex items-center gap-1 text-primaryColor"
    >
      <BsFillPencilFill />
      Edit
    </Link>
  );
};

export default EditButton;
