import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProductDetailClient from "./ProductDetailClient";

// 1. Helper Function (Memoized by Next.js automatically)
async function getProduct(slug) {
  const productId = slug.split("-").pop();
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);
  return productSnap.exists() ? { ...productSnap.data(), id: productId } : null;
}

// 2. Ultimate Metadata (Google + Social Media + Twitter)
export async function generateMetadata({ params }) {
  const { slug } = await params; // Next.js 15+ standard
  const product = await getProduct(slug);

  if (!product) return { title: "Product Not Found | Scarpa.pk" };

  const description = product.description?.slice(0, 160)
    || `Buy ${product.title} online in Pakistan at the best price. Premium quality footwear at Scarpa.pk.`;

  const fullImageUrl = product.images?.[0]?.startsWith("http")
    ? product.images[0]
    : `https://scarpa.pk${product.images?.[0] || "/logo.png"}`;

  return {
    title: `${product.title} - Buy Online in Pakistan | Scarpa`,
    description: description,
    alternates: {
      canonical: `https://scarpa.pk/product/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: [product.title, "shoes online Pakistan", "sneakers Pakistan", "Scarpa.pk"],
    openGraph: {
      title: product.title,
      description: description,
      url: `https://scarpa.pk/product/${slug}`,
      siteName: "Scarpa Pakistan",
      images: [{ url: fullImageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: description,
      images: [fullImageUrl],
    },
  };
}

// 3. Main Page Component
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#edf1f5]">
        <h1 className="text-xl font-bold text-gray-500">Product Not Found</h1>
      </div>
    );
  }

  // JSON-LD Schema (Safe & Verified)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images?.map(img =>
      img && img.startsWith("http")
        ? img
        : `https://scarpa.pk${img}`
    ),
    description: product.description || "Premium footwear by Scarpa.",
    brand: { '@type': 'Brand', name: 'Scarpa' },
    category: product.category,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: String(product.price),
      priceCurrency: 'PKR',
      availability: product.qty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://scarpa.pk/product/${slug}`,
    },
    // Only add rating if both rating and reviewsCount exist
    ...(product.rating && product.reviewsCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
      }

    })

  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://scarpa.pk'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category,
        item: `https://scarpa.pk/shop/category/${product.category}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://scarpa.pk/product/${slug}`
      }
    ]
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Product Detail UI */}
      <ProductDetailClient product={product} />
    </>
  );
}