import React from "react";
import Image from "next/image";
import demoImage from "@/public/demo_image.jpg";
import Link from "next/link";
import { AiTwotoneCalendar } from "react-icons/ai";
import moment from "moment";

const OtherBlogs = ({ otherBlogs }) => {
  const FormatTimer = () => {
    const timeStr = otherBlogs?.createdAt;
    const time = moment(timeStr);
    const formattedTime = time.format("MMMM Do YYYY");
    return formattedTime;
  };

  return (
    <section className="px-8 sm:px-12 py-10 grid ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 ">
        {otherBlogs?.length > 0 &&
          otherBlogs?.map((item, index) => (
            <div key={index} className="p-2 rounded-2xl">
              <Link href={`/blog/${item?._id}`}>
                <div>
                  {item?.image ? (
                    <>
                      <Image
                        src={item?.image ? item.image?.url : demoImage}
                        alt="blog image"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full rounded-2xl mb-2"
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs">
                      <p className="text-primaryColor">{item?.category}</p>

                      <p className="flex items-center gap-1 text-paragraphColor">
                        <AiTwotoneCalendar />
                        {FormatTimer()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-sm sm:text-xl md:text-2xl">
                        {item?.title}
                      </h2>
                      <p className="text-xs text-paragraphColor">
                        {item?.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3   ">
                      <Image
                        src={
                          item?.authorId?.avatar?.url
                            ? item?.authorId?.avatar?.url
                            : demoImage
                        }
                        alt="picture of the author"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-10 h-10 rounded-full"
                      />

                      <div className="text-xs">
                        <h6>{item?.authorId?.name}</h6>
                        <p className="text-paragraphColor">
                          {item?.authorId?.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
};

export default OtherBlogs;
