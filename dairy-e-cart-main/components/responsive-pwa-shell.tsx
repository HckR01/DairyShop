"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Lazy-load the heavy mobile app ONLY on client side and ONLY on small screens
const MobilePwaApp = dynamic(
  () => import("./mobile-pwa-app").then((mod) => mod.MobilePwaApp),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F6F5F0] text-stone-500 text-xs font-semibold">
        Loading PadmaDairy...
      </div>
    ),
  }
);

export function ResponsivePwaShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const bypassMobileShell =
    pathname?.startsWith("/admin") || pathname?.startsWith("/offline");

  if (bypassMobileShell) {
    return (
      <div className="flex min-h-screen flex-col">
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
    );
  }

  return (
    <>
      {/* Desktop / Tablet Web UI — rendered fast without rendering mobile app on server */}
      <div className="hidden min-h-screen flex-col md:flex">
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>

      {/* Mobile / Phone PWA App UI — loaded on demand ONLY when on phone */}
      <div className="md:hidden">
        {isMobile ? (
          <MobilePwaApp />
        ) : (
          <div className="flex min-h-screen flex-col">
            {header}
            <main className="flex-1">{children}</main>
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
