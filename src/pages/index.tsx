import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/homepage/features";
import { JoinCommunityBanner } from "@site/src/components/banners/join-community";
import { HomepageHeader } from "@site/src/components/layout/homepage-header";

export default function Home() {
  return (
    <Layout>
      <HomepageHeader />
      <main className="grow flex flex-col space-y-20 md:space-y-30 pb-25">
        <HomepageFeatures />
        <JoinCommunityBanner />
      </main>
    </Layout>
  );
}
