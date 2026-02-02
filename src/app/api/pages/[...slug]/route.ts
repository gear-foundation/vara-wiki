import { source } from '@/lib/source';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 },
    );
  }

  // Get raw MDX/body: prefer getText('raw') if available, else string body (body is MDXContent in Fumadocs)
  const pageData = page.data as unknown as { body?: unknown; getText?: (format?: string) => Promise<string> };
  let body: string;
  if (typeof pageData.body === 'string') {
    body = pageData.body;
  } else if (typeof pageData.getText === 'function') {
    try {
      body = await pageData.getText('raw');
    } catch {
      body = (await pageData.getText()) ?? '';
    }
  } else {
    body = '';
  }

  return NextResponse.json({
    title: page.data.title,
    description: page.data.description ?? null,
    body,
  });
}
