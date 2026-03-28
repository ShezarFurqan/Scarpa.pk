Your Sitemap does not contain any URLs. Please validate and resubmit your Sitemap// app/sitemap.xml.js
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  const productsSnap = await getDocs(collection(db, "products"));
  const products = productsSnap.docs.map(doc => doc.data());

  const urls = [
    { loc: "https://scarpa.pk/", priority: 1.0 },
    ...products.map(p => ({
      loc: `https://scarpa.pk/product/${p.slug}-${p.id}`,
      priority: 0.8
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        url => `
      <url>
        <loc>${url.loc}</loc>
        <priority>${url.priority}</priority>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}