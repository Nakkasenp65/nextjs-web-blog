"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import me from "@/public/demo_image.png";
import { AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [userData, setUserData] = useState({});
  const { data: session } = useSession();

  const pathName = usePathname();
  const [showDropDown, setShowDropDown] = React.useState(false);
  const handleShowDropDown = () => setShowDropDown(!showDropDown);

  async function fecthUser() {
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/${session?.user?._id}`
      );
      const resData = await res.json();
      setUserData(resData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fecthUser();
  }, [session?.user?._id]);

  return (
    <div className="fixed w-full flex justify-end xs:justify-between py-2 px-4 h-16 items-center bg-stone-900 top-0 ">
      <Link href={"/"} className="website-title">
        <h2 className="xs:text-base sm:text-2xl md:text-4xl ">
          Write
          <span className="special-word">Blog</span>
        </h2>
      </Link>

      <ul className=" flex  items-center gap-3 sm:gap-8 ">
        <li>
          <Link
            href={"/blog"}
            className={
              pathName === "/blog"
                ? "ease-in-out duration-500 text-primaryColor font-bold"
                : "ease-in-out duration-500 hover:font-bold"
            }
          >
            Blog
          </Link>
        </li>

        {session?.user ? (
          <>
            <li>
              <Link
                href={"/create-blog"}
                className={
                  pathName === "/create-blog"
                    ? "ease-in-out duration-500 text-primaryColor font-bold"
                    : "ease-in-out duration-500 hover:font-bold"
                }
              >
                Write
              </Link>
            </li>
            <li>
              <div className="relative">
                <div
                  onClick={handleShowDropDown}
                  className="flex items-center px-2 py-1 rounded-2xl gap-2 w-max sm:bg-stone-700 cursor-pointer"
                >
                  <div className="hidden px-2 sm:flex">{userData?.name}</div>
                  <Image
                    onClick={handleShowDropDown}
                    src={userData?.avatar?.url ? userData?.avatar?.url : me}
                    alt="avatar"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                </div>

                {showDropDown && (
                  <div className="absolute text-sm flex flex-col justify-between items-center top-0 right-0 bg-stone-800 w-32 rounded-xl">
                    <div
                      onClick={handleShowDropDown}
                      className="ease-in-out duration-300 hover:bg-stone-700 hover:rounded-t-xl w-full cursor-pointer flex justify-center items-center border-stone-300 py-4 "
                    >
                      Close
                    </div>

                    <button
                      onClick={() => {
                        signOut();
                        handleShowDropDown();
                      }}
                      className="ease-in-out duration-300 hover:bg-stone-700 w-full text-center py-4 "
                    >
                      Logout
                    </button>

                    <Link
                      onClick={handleShowDropDown}
                      href={`/user/${session?.user?._id.toString()}`}
                      className="ease-in-out duration-300 hover:bg-stone-700 hover:rounded-b-xl w-full text-center py-4 "
                    >
                      Profile
                    </Link>
                  </div>
                )}
              </div>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href={"/login"}
                className={
                  pathName === "/login"
                    ? "text-primaryColor ease-in-out duration-500 hover:font-bold"
                    : "ease-in-out duration-500 hover:font-bold"
                }
              >
                Log In
              </Link>
            </li>
            <li>
              <Link
                href={"/signup"}
                className={
                  pathName === "/signup"
                    ? "text-primaryColor ease-in-out duration-500 hover:font-bold"
                    : "ease-in-out duration-500 hover:font-bold"
                }
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
