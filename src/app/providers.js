"use client";

import { useEffect } from "react";

export default function Providers({ children }) {
  useEffect(() => {
    // ANY document / window logic goes here
  }, []);

  return children;
}
