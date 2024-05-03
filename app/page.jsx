import Link from "next/link";
import { FcGraduationCap } from "react-icons/fc";

export default function Home() {
  return (
    <div className="container flex flex-col md:flex-row gap-8 h-[calc(100vh-5rem)] sm:mt-0">
      <div className="basis-full flex flex-col justify-center md:basis-2/3 gap-8">
        <p className="special-word text-xs">Unleash Your Creativity</p>

        <h1>
          Welcome to{" "}
          <span className="ease-in-out duration-500 special-word cursor-pointer hover:text-6xl">
            WriteBlog
          </span>
        </h1>

        <p>
          WriteBlog is your premier destination for crafting compelling
          narratives and sharing your voice with the world. Dive into the art of
          storytelling, connect with fellow writers, and embark on a journey of
          self-expression unlike any other. Join us and let your words ignite
          inspiration and spark conversation.
        </p>
      </div>

      <Link href={"/learn"} className="hidden md:block basis-1/3">
        <FcGraduationCap className="ease-in-out duration-500 w-full h-auto mt-52 hover:drop-shadow-glow hover:scale-105  cursor-pointer" />
      </Link>
    </div>
  );
}
