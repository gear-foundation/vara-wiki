import { JoinCommunityBanner } from "@/components/banners/join-community";
import { HomepageFeaturesV1 } from "@/components/homepage/features-v1";
import { HomepageHero } from "@/components/homepage/hero";

export default function Home() {
  return (
    <main className="grow flex flex-col pb-50">
      <HomepageHero />
      <div className="pt-30 space-y-20 md:space-y-30">
        <HomepageFeaturesV1 />
        <JoinCommunityBanner />
      </div>
    </main>
  );
}
