import { Types } from "mongoose";

export interface IUser {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  designation?: string;
  avatar?: {
    id?: string;
    url?: string;
  };
  age?: string;
  location?: string;
  about?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  _id?: string | Types.ObjectId;
  user: string | Types.ObjectId | IUser;
  text: string;
  date: Date;
}

export interface IBlog {
  _id: string | Types.ObjectId;
  title: string;
  description: string;
  excerpt: string;
  quote: string;
  image?: {
    id?: string;
    url?: string;
  };
  category: string;
  authorId: string | Types.ObjectId | IUser;
  likes: (string | Types.ObjectId)[];
  views: number;
  comments: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}
