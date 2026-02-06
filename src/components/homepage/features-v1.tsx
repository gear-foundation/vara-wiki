"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FEATURES_DATA, type FeatureItem } from "@/lib/data/features.data";

/**
 * Variant 1: Compact grid cards with icons on top
 * Modern, clean design with hover effects
 */
export function HomepageFeaturesV1() {
  return (
    <section className="container">
      <div className="flex flex-nowrap gap-6">
        {FEATURES_DATA.map((props, idx) => (
          <div key={idx} className="flex-1 min-w-0">
            <FeatureCard {...props} />
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ title, img, description, url }: FeatureItem) {
  return (
    <Card
      as={Link}
      href={url}
      className="group/card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full no-underline"
    >
      <CardHeader className="pb-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-muted transition-colors group-hover/card:bg-primary/10">
          <Image
            src={img}
            alt={`${title} icon`}
            width={40}
            height={40}
            className="transition-transform duration-300 group-hover/card:scale-110"
          />
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid space-y-4 h-full">
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>

        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-auto pointer-events-none"
        >
          Learn More
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/card:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
