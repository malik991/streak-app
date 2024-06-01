import CarouselPage from "@/components/myCarsol";
export default function dashboardPage() {
  return (
    <section className="mt-8">
      <div className="mx-auto w-full flex flex-col gap-y-9 p-4 items-center">
        <div className="p-1">
          <h1 className="text-8xl text-primary font-bold tracking-tighter">
            WELCOME TO STREAK
          </h1>
        </div>
        <div className="">
          <CarouselPage />
        </div>
      </div>
    </section>
  );
}
