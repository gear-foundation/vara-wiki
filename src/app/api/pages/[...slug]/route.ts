import { NextResponse } from "next/server";
import { getPageBodyWithAbsoluteUrls } from "@/lib/page-content";
import { source } from "@/lib/source";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const body = await getPageBodyWithAbsoluteUrls(page);

  return NextResponse.json({
    title: page.data.title,
    description: page.data.description ?? null,
    body,
  });
}
