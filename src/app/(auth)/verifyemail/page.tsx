"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function verifyEmailPage() {
  const [token, setToken] = useState("");
  const [verifyToken, setVerifyToken] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessgae, setErrorMessage] = useState("");

  useEffect(() => {
    const tokenfromUrl = window.location.search.split("=")[1];
    setToken(tokenfromUrl || "");
  }, []);

  useEffect(() => {
    setErrorMessage("");
    setError(false);
    if (token.length > 0) {
      verifyEmailToken();
    } else {
      setError(true);
      setErrorMessage("check your email inbox and click on the link");
    }
  }, [token]);

  async function verifyEmailToken() {
    setErrorMessage("");
    try {
      const isVerifiedOrNot = await axios.post(
        "/api/users/verifytoken?token=" + token
      );
      if (isVerifiedOrNot.data.success) {
        setVerifyToken(true);
        setError(false);
      }
    } catch (error: any) {
      setError(true);
      setVerifyToken(false);
      setErrorMessage(error?.message || "error while verify email");
      console.log("error while verify email: ", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl text-secondry" style={{ letterSpacing: "-1px" }}>
        {!token && "your email verification is pending"}
      </h1>

      {verifyToken && (
        <div>
          <h2 className="text-2xl">Your Email is Verified! 😊</h2>
          <p className="text-md">please click here to: </p>
          <Link href="/signin" className=" text-secondry text-xl underline">
            Login
          </Link>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-secondry text-white p-3 mt-2">
            {errorMessgae}
          </h2>
        </div>
      )}
    </div>
  );
}
