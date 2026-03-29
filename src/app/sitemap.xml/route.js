import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

function slugify(text) {
  if (!text) return "product";
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

export async function GET() {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));


    const urls = [
      { loc: "https://scarpa.pk/", lastmod: new Date().toISOString().split("T")[0], changefreq: "daily", priority: 1.0 },
      ...products.map(p => ({
        loc: `https://scarpa.pk/product/${slugify(p.title)}-${p.id}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: 0.8
      }))
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return new Response(xml, { headers: { "Content-Type": "application/xml" } });

  } catch (err) {
    console.error("Sitemap Error:", err);
    return new Response("Error generating sitemap", { status: 500 });
  }
}