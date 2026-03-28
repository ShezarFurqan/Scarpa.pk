import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

export const runtime = "edge"; // Fastest response

export async function GET() {
  const productsCol = collection(db, "products");
  const productsSnap = await getDocs(productsCol);

  const baseUrl = "https://scarpa.pk";
  const today = new Date().toISOString();

  let urls = `
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${today}</lastmod>
    </url>
  `;

  productsSnap.forEach((doc) => {
    const product = doc.data();
    const slug = `${product.title.toLowerCase().replace(/\s+/g, "-")}-${doc.id}`;
    urls += `
      <url>
        <loc>${baseUrl}/product/${slug}</loc>
        <lastmod>${today}</lastmod>
      </url>
    `;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}