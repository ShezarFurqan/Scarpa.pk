import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

// Simple slugify function
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // spaces to dash
    .replace(/[^\w\-]+/g, '')  // remove special chars
    .replace(/\-\-+/g, '-');   // remove double dashes
}

export async function GET() {
  const productsSnap = await getDocs(collection(db, "products"));
  const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const urls = [
    { loc: "https://scarpa.pk/", priority: 1.0 },
    ...products.map(p => ({
      loc: `https://scarpa.pk/product/${slugify(p.title)}-${p.id}`,
      priority: 0.8
    }))
  ];

  console.log(urls)

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