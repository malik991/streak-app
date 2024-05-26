import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/Logo.svg";

export default function Header() {
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
        <nav className="flex items-center lg:gap-x-5 font-semibold">
          <Link href={"/login"} className="text-secondry text-lg">
            Login
          </Link>
          <Link
            href={"/signup"}
            className="bg-primary px-5 py-1 text-white rounded-lg"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
