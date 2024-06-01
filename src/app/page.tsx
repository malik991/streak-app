"use client";

import FaqPage from "@/components/layout/FAQ";
import CarouselPage, { CarouselOrientation } from "@/components/myCarsol";

export default function Home() {
  return (
    <>
      <section className="my-6">
        <div className=" w-full flex flex-col gap-y-9 p-4 items-center">
          <div className="p-1">
            <h1 className="md:text-8xl text-4xl text-primary font-bold tracking-tighter">
              WELCOME TO STREAK
            </h1>
          </div>
          <div className="w-full flex items-center justify-center px-5">
            <CarouselPage />
          </div>
          <h1 className="md:text-5xl text-2xl text-secondry font-bold tracking-tighter mb-3">
            Instruction Regarding using App
          </h1>
          <div className="w-full flex items-center justify-center p-6">
            <CarouselOrientation />
          </div>
        </div>
      </section>
      <section className="my-6">
        <FaqPage />
      </section>
    </>
  );
}
