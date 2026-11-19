/**
 * Dynamic API URL resolver:
 * - On PC (localhost) -> http://localhost:5000/api
 * - On Phone / LAN (192.168.x.x) -> http://<phone-same-ip>:5000/api
 * - Deployed (Vercel) -> process.env.NEXT_PUBLIC_API_URL
 */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
      return `http://${host}:5000/api`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
}
