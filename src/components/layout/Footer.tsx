import Image from "next/image";
import xx from "../../../public/X.svg";
import facebook from "../../../public/Facebook.svg";
import linked from "../../../public/Feed.svg";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="p-3">
      <footer className="border-t-2 mt-8 pt-8 ">
        <div
          className="flex md:flex-row flex-col md:justify-between
         justify-center items-center md:gap-y-0 gap-y-4"
        >
          <div>
            <span className="text-lg text-gray-500">
              Made with 💖 by{" "}
              <a
                href="https://www.linkedin.com/in/mubashar-hassan-sci/"
                target="_blank"
                className="hover:underline text-primary"
              >
                Al-Rehman
              </a>{" "}
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-x-5">
            <Link href={"/"}>
              <Image src={xx} alt="twiter" />
            </Link>
            <Link href={"/"}>
              <Image src={facebook} alt="facebook" />
            </Link>
            <Link href={"/"}>
              <Image src={linked} alt="linkedIN" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
