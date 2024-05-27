import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export interface AuthNavigationProps {
  userName: string;
  status: string;
}

// const AuthNavigation: React.FC<AuthNavigationProps> = ({
//   userName,
//   status,
// }): JSX.Element => {
//   if (status === "authenticated") {
//     return (
//       <>
//         <Link href="/profile" className="whitespace-nowrap">
//           Hello, {userName}
//         </Link>
//         <button
//           onClick={() => signOut({ callbackUrl: "/" })}
//           className="bg-primary px-5 py-1 text-white rounded-full"
//         >
//           Logout
//         </button>
//       </>
//     );
//   } else {
//     return (
//       <>
//         <Link href="/signin" className="text-secondry text-lg">
//           Login
//         </Link>
//         <Link
//           href="/signup"
//           className="bg-primary px-5 py-1 text-white rounded-lg"
//         >
//           Register
//         </Link>
//       </>
//     );
//   }
// };

function AuthNavigation(inputParam: AuthNavigationProps): any {
  if (inputParam.status === "loading") {
    return "wait";
  }
  if (inputParam.status === "authenticated") {
    return (
      <>
        <Link
          href="/profile"
          className="whitespace-nowrap text-secondry font-bold"
        >
          Hello, {inputParam.userName}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-primary px-5 py-1 text-white rounded-full"
        >
          Logout
        </button>
      </>
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
