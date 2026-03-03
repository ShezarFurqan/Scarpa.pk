
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ShopContextProvider from "./Context/ShopContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import Providers from "./providers";
import { LoadingProvider } from './Context/LoginContext';

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
