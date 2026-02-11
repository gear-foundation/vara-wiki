"use client";

import Image from "next/image";
import { VideoWrapper } from "@/components/sections/home/blocks/video-wrapper";
import { cn } from "@/lib/cn";

const BGImage = "/images/join-banner/arrow-wave-start.jpg";
const BGImageWebp = "/images/join-banner/arrow-wave-start.webp";

type Props = {
  className?: string;
};

export function HeroBgVideo({ className }: Props) {
  return (
    <div
      className={cn(
        "absolute inset-0",
        "after:absolute after:inset-0 after:z-2",
        "after:join-community-banner-gradients dark:after:join-community-banner-gradients-dark",
        className,
      )}
    >
      <picture>
        <source type="image/webp" srcSet={BGImageWebp} />
        <Image
          src={BGImage}
          alt="Gear IDEA"
          width={1440}
          height={810}
          className="size-full object-cover dark:invert"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </picture>
      <VideoWrapper inView className="dark:invert">
        <source
          src="/videos/homepage/arrow-wave-265.mp4"
          type="video/mp4; codecs=hev1"
        />
        <source
          src="/videos/homepage/arrow-wave-264.mp4"
          type="video/mp4; codecs=avc1.42E01E"
        />
        Your browser does not support the video tag.
      </VideoWrapper>
    </div>
  );
}
