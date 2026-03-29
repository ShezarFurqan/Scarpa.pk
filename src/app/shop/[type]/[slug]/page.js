import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import CollectionClient from "./CollectionClient";

/**
 * 1. HELPER: URL slug matching ke liye
 */
const formatForMatch = (str) => str?.toLowerCase().replace(/\s+/g, '') || "";

/**
 * 2. SERVER-SIDE SEO DATA FETCHING
 */
async function getCollectionSEO(type, slug) {
  let title = slug.replace(/-/g, ' ');
  let description = `Explore our premium ${title} collection at Scarpa.pk. Buy original, high-quality footwear and sneakers in Pakistan at the best prices.`;

  if (type === 'custom' || type === 'collection') {
    try {
      const querySnapshot = await getDocs(collection(db, 'Productcollections'));
      const formattedSlug = formatForMatch(slug);
      const matchedDoc = querySnapshot.docs.find(doc => formatForMatch(doc.data().title) === formattedSlug);

      if (matchedDoc) {
        const data = matchedDoc.data();
        title = data.title;
        if (data.description) description = data.description;
      }
    } catch (e) {
      console.error("SEO Fetch Error:", e);
    }
  }

  // Title Case Formatting (e.g. "running shoes" -> "Running Shoes")
  const capitalizedTitle = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { title: capitalizedTitle, description };
}

/**
 * 3. DYNAMIC METADATA (Google, Social Media, Robots)
 */
export async function generateMetadata({ params }) {
  const { type, slug } = await params;
  const { title, description } = await getCollectionSEO(type, slug);

  return {
    title: `${title} - Buy Online in Pakistan | Scarpa.pk`,
    description: description,
    metadataBase: new URL('https://scarpa.pk'),
    alternates: {
      canonical: `/shop/${type}/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    keywords: [title, `${title} shoes Pakistan`, "buy sneakers online", "Scarpa.pk collections", "premium footwear"],
    openGraph: {
      title: `${title} Collection | Scarpa.pk`,
      description: description,
      url: `/shop/${type}/${slug}`,
      siteName: "Scarpa Pakistan",
      images: [
        {
          url: '/images/shop-og-banner.jpg', // Make sure this image exists in your public/images folder
          width: 1200,
          height: 630,
          alt: `Shop ${title} at Scarpa.pk`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} Collection | Scarpa.pk`,
      description: description,
    },
  };
}

/**
 * 4. MAIN SERVER COMPONENT (Schemas + Client Component)
 */
export default async function Page({ params }) {
  const { type, slug } = await params;
  const { title, description } = await getCollectionSEO(type, slug);

  // Schema 1: Collection Page
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${title} Collection`,
    description: description,
    url: `https://scarpa.pk/shop/${type}/${slug}`,
  };

  // Schema 2: Breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://scarpa.pk' },
      { '@type': 'ListItem', position: 2, name: type.toUpperCase(), item: `https://scarpa.pk/shop/${type}` },
      { '@type': 'ListItem', position: 3, name: title, item: `https://scarpa.pk/shop/${type}/${slug}` }
    ]
  };

  // Schema 3: FAQ (CTR Booster)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Where to buy original ${title} shoes in Pakistan?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can buy authentic and premium ${title} shoes online at Scarpa.pk with fast delivery across Pakistan.`
        }
      },
      {
        "@type": "Question",
        "name": `Are the ${title} sneakers at Scarpa.pk authentic?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, all footwear at Scarpa.pk, including the ${title} collection, is guaranteed 100% original and high-quality.`
        }
      }
    ]
  };

  // Schema 4: ItemList (Rich Results for Product Listings)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${title} Collection`,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": `${title} Premium Selection 1` },
      { "@type": "ListItem", "position": 2, "name": `${title} Exclusive Item 2` }
    ]
  };

  return (
    <>
      {/* Injecting All Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Rendering the Client Component for UI and Interaction */}
      <CollectionClient type={type} slug={slug} title={title} />
    </>
  );
}