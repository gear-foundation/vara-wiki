import "./global.css";
import "katex/dist/katex.min.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import { Body } from "./layout.client";

const font = Anuphan({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s | Vara Network Documentation Portal",
    default: "Vara Network Documentation Portal",
  },
  description: "Guides, quick start, program examples, and API reference for building dApps on Vara Network",
  metadataBase: new URL("https://wiki.vara.network"),
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${font.variable}`}>
      {process.env.NODE_ENV === "production" && (
        <GoogleTagManager gtmId="GTM-NH2N6VX" />
      )}
      <Body>
        <RootProvider
          theme={{
            defaultTheme: "dark",
          }}
        >
          {children}
        </RootProvider>
      </Body>
    </html>
  );
}
