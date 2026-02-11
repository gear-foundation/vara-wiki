import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { IconLogo } from "@/components/icons/icon-logo";
import { getPageImage, source } from "@/lib/source";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const origin = new URL(req.url).origin;
  const [fontRegular, fontBold] = await Promise.all([
    fetch(new URL("/fonts/Anuphan-400.ttf", origin))
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null),
    fetch(new URL("/fonts/Anuphan-700.ttf", origin))
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null),
  ]);

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "white",
        padding: "4rem",
        fontFamily: "Anuphan",
        backgroundColor: "#0b0b0b",
        backgroundImage:
          "linear-gradient(110deg, #0b0b0b 0%, #0a1412 40%, #0b0b0b 100%)",
      }}
    >
      <IconLogo
        width={980}
        height={630}
        style={{
          position: "absolute",
          right: "-50px",
          top: "0",
          color: "#ffffff",
          opacity: 0.16,
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          display: "flex",
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.8) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          display: "flex",
          backgroundImage:
            "radial-gradient(ellipse 140% 120% at -15% 110%, rgba(0,255,196,0.38) 0%, rgba(0,255,196,0.24) 22%, rgba(0,255,196,0.12) 45%, rgba(0,255,196,0) 78%), linear-gradient(135deg, rgba(0,255,196,0.18) 0%, rgba(0,255,196,0.06) 30%, rgba(0,255,196,0) 60%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Vara Network Documentation Portal
          </p>
        </div>
        <p
          style={{
            fontWeight: 700,
            fontSize: "74px",
            marginTop: "38px",
          }}
        >
          {page.data.title}
        </p>
        <p
          style={{
            fontSize: "44px",
            color: "rgba(240,240,240,0.8)",
          }}
        >
          {page.data.description}
        </p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts:
        fontRegular && fontBold
          ? [
              {
                name: "Anuphan",
                data: fontRegular,
                weight: 400,
                style: "normal",
              },
              {
                name: "Anuphan",
                data: fontBold,
                weight: 700,
                style: "normal",
              },
            ]
          : [],
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
