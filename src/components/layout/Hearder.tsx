"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/Logo.svg";
import { useSession } from "next-auth/react";
import AuthNavigation from "../AuthNavigation";

export default function Header() {
  const session = useSession();
  const userData = session?.data?.user;
  let userName = userData?.name || userData?.email;
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  return (
    <header className="">
      <div className="flex items-center justify-between p-3">
        <nav>
          <Link href={"/"} className="flex items-center gap-x-1">
            <Image src={logo} alt="logo" />
            <span
              className="text-secondry font-semibold pt-4 lg:font-bold"
              style={{ letterSpacing: "-1px" }}
            >
              Alrehman AI
            </span>
          </Link>
        </nav>
        <nav className="flex items-center md:gap-x-5 gap-x-3 font-semibold">
          <AuthNavigation
            userName={userName?.toString() || ""}
            status={session?.status || "unauthenticated"}
          />
        </nav>
      </div>
    </header>
  );
}
