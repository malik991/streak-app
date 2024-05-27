import Image from "next/image";
import logo from "../../public/Logo.svg";

export default function Home() {
  return (
    <>
      <section className="mt-8">
        <div className="max-w-3xl mx-auto items-center">
          <div className="flex flex-col items-center gap-y-9 p-4 w-full">
            <div className="flex justify-center rounded-md items-center bg-gray-100 shadow-md w-3/4 px-9 py-5">
              <Image src={logo} alt="logo pic" width={100} height={100} />
            </div>
            <div
              className="mt-3 max-w-full rounded-md
             mx-auto text-secondry flex flex-col gap-3
              bg-gray-100 shadow-md px-9 py-5"
            >
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don&apos;t look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn&apos;t anything
                embarrassing hidden in the middle of text.
              </p>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don&apos;t look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn&apos;t anything
                embarrassing hidden in the middle of text.
              </p>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
