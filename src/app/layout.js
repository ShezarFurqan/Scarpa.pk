
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ShopContextProvider from "./Context/ShopContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import Providers from "./providers";
import { LoadingProvider } from './Context/LoginContext';
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Scarpa – Best Shoes Online in Pakistan",
  description: "Buy premium shoes online at Scarpa.pk – Fast delivery across Pakistan.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-[#edf1f5] ${geistMono.variable} antialiased`}
      >
        import Script from "next/script";

        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];
      t=b.createElement(e);t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
      }(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '702285799609765');
      fbq('track', 'PageView');
    `,
          }}
        />
        <Providers>
          <LoadingProvider>
            <ShopContextProvider>
              <Navbar />
              <div className="">
                {children}
              </div>
              <Footer />
            </ShopContextProvider>
          </LoadingProvider>
        </Providers>

      </body>
    </html>
  );
}
