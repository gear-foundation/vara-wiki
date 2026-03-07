"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  { ssr: false },
);

const HERO_HEIGHT_MOBILE = 280;
const HERO_HEIGHT_DESKTOP = 560;

// Teal/primary-tinted colors for Vara brand (works in light and dark)
const GRAIN_COLORS = ["#0d9488", "#14b8a6", "#2dd4bf"];

export function HomepageHero() {
  const [showShaders, setShowShaders] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const t = setTimeout(() => setShowShaders(true), 400);
    return () => clearTimeout(t);
  }, []);

  const heroHeight = isMobile ? HERO_HEIGHT_MOBILE : HERO_HEIGHT_DESKTOP;

  return (
    <section className="relative flex min-h-[min(calc(40svh),560px)] items-center justify-center overflow-hidden dark:bg-card">
      {/* Shader background (delayed mount to avoid uniform load errors on slow devices) */}
      {showShaders ? (
        <div
          className="absolute inset-0 z-0 w-full opacity-90 dark:opacity-80"
          style={{ height: heroHeight, minHeight: "min(40svh, 560px)" }}
        >
          <GrainGradient
            height={heroHeight}
            width="100%"
            colors={GRAIN_COLORS}
            colorBack="#00000000"
            softness={0.7}
            intensity={0.12}
            noise={isMobile ? 0.25 : 0.45}
            shape="wave"
            speed={0.5}
            scale={isMobile ? 1 : 2.5}
            offsetX={1}
            offsetY={0.6}
            className="h-full w-full bg-transparent"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0" aria-hidden />
      )}

      {/* Fallback gradient layer (blends with shader) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ minHeight: "min(40svh, 560px)" }}
      />

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center justify-center py-8 text-center text-foreground md:py-10">
        <h1 className="mb-0 font-semibold text-[42px]/[50px] md:text-[46px]/[55px] lg:text-[56px]/[1.2]">
          <span className="inline-block mx-auto gradient-text-white">
            Vara Network
          </span>{" "}
          documentation
        </h1>
        <div className="mix-blend-difference mt-3 space-y-2 text-base font-medium text-muted-foreground *:mb-0 text-balance md:text-[18px]/[24px]">
          <p>
            Guides, quick start, program examples, and API reference for
            building dApps on Vara
          </p>
        </div>
      </div>
    </section>
  );
}
