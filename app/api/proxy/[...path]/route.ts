import { NextRequest, NextResponse } from "next/server";

const isProxyUrl = (url: string) => /\/api\/proxy\/?$/.test(url);

const resolveBackendBaseUrl = () => {
  const serverBaseUrl = process.env.API_BASE_URL?.trim();
  if (serverBaseUrl) {
    return serverBaseUrl;
  }

  const publicBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (publicBaseUrl && !isProxyUrl(publicBaseUrl)) {
    return publicBaseUrl;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3001/api";
  }

  return null;
};

async function forwardRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const backendBaseUrl = resolveBackendBaseUrl();
  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        message:
          "Proxy is not configured. Set API_BASE_URL in production environment.",
      },
      { status: 500 },
    );
  }

  const { path = [] } = await context.params;
  const targetPath = path.join("/");

  const search = request.nextUrl.search || "";
  const targetUrl = `${backendBaseUrl.replace(/\/$/, "")}/${targetPath}${search}`;

  const headers = new Headers();

  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers.set("authorization", authorization);
  }

  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const isBodyAllowed = !["GET", "HEAD"].includes(request.method);

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: isBodyAllowed ? await request.text() : undefined,
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const responseContentType = upstreamResponse.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  const setCookie = upstreamResponse.headers.get("set-cookie");
  if (setCookie) {
    responseHeaders.set("set-cookie", setCookie);
  }

  return new NextResponse(await upstreamResponse.text(), {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}