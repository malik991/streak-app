"use client";
import { useSession } from "next-auth/react";

export default function profilePage() {
  const session = useSession();
  if (session?.status === "loading") {
    return "loading ...";
  }
  if (session?.status === "authenticated") {
    console.log(session);

    return <h1>welcom {session?.data?.user?.email}</h1>;
  }

  return <h1>hello from profile</h1>;
}
