import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import DropdownMenuDemo from "@/components/dropDownMenu/index";

export interface AuthNavigationProps {
  userName: string;
  status: string;
}

function AuthNavigation(inputParam: AuthNavigationProps): any {
  if (inputParam.status === "loading") {
    return <Loader2 className="animate-spin" />;
  }
  if (inputParam.status === "authenticated") {
    return (
      <div>
        <DropdownMenuDemo />
      </div>
    );
  } else {
    return (
      <>
        <Link href="/signin" className="text-secondry text-lg">
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-primary px-5 py-1 text-white rounded-lg"
        >
          Register
        </Link>
      </>
    );
  }
}

export default AuthNavigation;
