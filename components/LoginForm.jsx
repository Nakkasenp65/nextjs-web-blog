"use client";

import React from "react";
import Input from "./Input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const initialState = {
  name: "",
  email: "",
  password: "",
};

const LoginForm = () => {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState({ initialState });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const handleChange = (event) => {
    setError("");
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = state;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!pattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Credentials");
        setIsLoading(false);
        return;
      }

      router.push("/blog");
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <section className="container flex justify-center items-center h-[calc(100vh-5rem)]">
      <form
        action=""
        className="border-2 border-paragraphColor rounded-2xl max-w-sm my-auto mx-auto p-8 space-y-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center special-word">Log in</h2>

        <Input
          label="Email"
          type="text"
          name="email"
          onChange={handleChange}
          value={state.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={state.password}
        />

        {error && <div className="text-red-700"> {error} </div>}

        {success && <div className="text-green-700"> {error} </div>}

        <button type="submit" className="btn w-full">
          {isLoading ? "Loading..." : "Login"}
        </button>

        <p className="text-center">
          Need an account?{" "}
          <Link href={"/login"} className="text-primaryColor">
            Sign Up
          </Link>{" "}
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
