import { rewrite } from '@vercel/edge';

export const config = {
  matcher: ['/api/:path*'],
};

export default async function middleware(req: Request) {
  const url = new URL(req.url);

  const path = url.pathname.replace(/^\/api/, '');
  url.pathname = path;
  url.host = process.env.API_HOST || "localhost";

  return rewrite(url);
}