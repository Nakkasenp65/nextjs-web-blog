import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="contaienr h-full mt-64 flex flex-col gap-5 justify-center items-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={"/"}>Return Home</Link>
    </div>
  );
};

export default NotFound;
