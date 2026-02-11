import "./global.css";
import "katex/dist/katex.min.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Anuphan } from "next/font/google";

const font = Anuphan({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Vara Network Documentation Portal",
  description: "All documentation related to Vara Network",
  metadataBase: new URL(process.env.APP_URL || "https://wiki.vara.network"),
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${font.variable}`}>
      {process.env.NODE_ENV === "production" && (
        <GoogleTagManager gtmId="GTM-NH2N6VX" />
      )}
      <body className="flex flex-col min-h-screen">
        <RootProvider
          theme={{
            defaultTheme: "dark",
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
