import { HomeLayout } from "fumadocs-ui/layouts/home";
import { MainFooter } from "@/components/homepage/main-footer";
import { homepageOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout {...homepageOptions()}>
      {children}
      <MainFooter />
    </HomeLayout>
  );
}
