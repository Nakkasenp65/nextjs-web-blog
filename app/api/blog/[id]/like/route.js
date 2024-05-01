import Blog from "@/models/Blog";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";

export async function PUT(req, res) {
  await connect();

  const id = res.params.id;
  const accessToken = req.headers.get("authorization");
  const token = accessToken.split(" ")[1];

  const decodedToken = verifyJwtToken(token);

  //check token
  if (!accessToken || !decodedToken)
    return NextResponse.json(
      { error: "unauthorized (invalid token or expired session)" },
      { status: 403 }
    );

  try {
    //check authorId and sessionId
    //The logic is to include the guy who like the blog into the blog's likes
    //So just checking that if the guy not in the likes list yet, add him.

    const blog = await Blog.findById(id);
    if (blog.likes.includes(decodedToken._id)) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== decodedToken._id.toString()
      );
    } else {
      blog.likes.push(decodedToken._id);
    }

    await blog.save();

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "PUT error" }, { status: 500 });
  }
}
