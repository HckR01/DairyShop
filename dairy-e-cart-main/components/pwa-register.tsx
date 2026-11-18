"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let updateInterval: ReturnType<typeof setInterval> | undefined;

    const registerSW = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);

          // Check for updates every hour
          updateInterval = setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Handle updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("[PWA] New version available! Refresh to update.");
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });
    };

    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }

    return () => {
      window.removeEventListener("load", registerSW);
      if (updateInterval) clearInterval(updateInterval);
    };
  }, []);

  return null;
}
