import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import girl from "../../public/images/hero-image.png";
import boy1 from "../../public/images/hero-image1.png";
import boy2 from "../../public/images/about-me-memoji.jpg";

export default function CarouselPage() {
  const myArray = [girl, boy1, boy2];

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {myArray.map((item, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-auto items-center justify-center p-4 relative">
                  {/* <span className="text-4xl font-semibold">{item}</span> */}
                  {/* md:h-[80vh] h-[50vh] */}
                  <Image
                    className="rounded-lg"
                    priority={true}
                    src={item}
                    alt={`slide ${index + 1}`}
                    width={1000}
                    height={1000}
                    //fill={true}
                    style={{
                      objectFit: "contain",
                      // width: "auto",
                      // height: "auto",
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export function CarouselOrientation() {
  const instructionArray = [
    { name: "1: login" },
    { name: "2: click on menue" },
    { name: "3:  read instructions" },
    { name: "4:  continue to read" },
    { name: "5:  one more time" },
  ];
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full md:max-w-xl max-w-xs"
    >
      <CarouselContent className="-mt-1 h-[200px]">
        {instructionArray.map((item, index) => (
          <CarouselItem key={index} className="pt-1 md:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="md:text-3xl text-lg font-semibold">
                    {item.name}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
