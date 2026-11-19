"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  CalendarClock,
  Package,
  User,
  Search,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Leaf,
  Tag,
  Copy,
  LogOut,
  Edit3,
  Eye,
  EyeOff,
  Download,
  CreditCard,
  Wallet,
  Banknote,
  Trash2,
  RefreshCw,
  Milk,
  Flame,
  Gift,
  XCircle,
  Settings,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import { useCart, Product } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { products as fallbackProducts, offers, categories } from "@/lib/products";
import { getApiUrl } from "@/lib/api-config";
import { toast } from "sonner";

type TabId = "home" | "shop" | "sub" | "orders" | "account";
type CartStep = "cart" | "checkout" | "success";

const SUB_PLANS = [
  {
    id: "daily" as const,
    name: "Daily",
    badge: "15% OFF",
    discount: 15,
    tagline: "Fresh before 7 AM every day",
    perks: ["Free morning doorstep drop", "Pause or skip any day", "Maximum 15% savings"],
  },
  {
    id: "weekly" as const,
    name: "Weekly",
    badge: "10% OFF",
    discount: 10,
    tagline: "Restock once a week",
    perks: ["Pick your delivery day", "Flexible quantity edits", "10% off every week"],
  },
  {
    id: "monthly" as const,
    name: "Monthly",
    badge: "5% OFF",
    discount: 5,
    tagline: "Monthly family staples",
    perks: ["Guaranteed free delivery", "Best for ghee & butter", "Cancel anytime"],
  },
];

const CATEGORY_META: Record<string, { emoji: string; bg: string; ring: string }> = {
  All: { emoji: "✨", bg: "bg-emerald-50", ring: "ring-emerald-200" },
  Milk: { emoji: "🥛", bg: "bg-sky-50", ring: "ring-sky-200" },
  Yogurt: { emoji: "🥣", bg: "bg-amber-50", ring: "ring-amber-200" },
  Cheese: { emoji: "🧀", bg: "bg-yellow-50", ring: "ring-yellow-200" },
  "Ghee & Butter": { emoji: "🧈", bg: "bg-orange-50", ring: "ring-orange-200" },
  Cream: { emoji: "🍦", bg: "bg-pink-50", ring: "ring-pink-200" },
  Beverages: { emoji: "🥤", bg: "bg-teal-50", ring: "ring-teal-200" },
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop";

export function MobilePwaApp() {
  const pathname = usePathname();
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const { user, isAuthenticated, login, signup, logout, updateProfile } = useAuth();

  // Navigation & Sheets
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<CartStep>("cart");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [offersOpen, setOffersOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"default" | "low" | "high">("default");

  // Subscriptions
  const [selectedPlan, setSelectedPlan] = useState<"daily" | "weekly" | "monthly">("daily");
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  // Checkout
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [checkoutAddr, setCheckoutAddr] = useState({
    name: "",
    phone: "",
    street: "",
    city: "Puri",
    pincode: "",
  });

  // Inline Auth (Account tab)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Profile Editor
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // PWA Install Prompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Dynamic Greeting (computed client-side to prevent SSR hydration mismatch)
  const [greeting, setGreeting] = useState<{ text: string; Icon: typeof Sun }>({
    text: "Welcome",
    Icon: Sun,
  });

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting({ text: "Good Morning", Icon: Sun });
    else if (hr < 17) setGreeting({ text: "Good Afternoon", Icon: Sunset });
    else setGreeting({ text: "Good Evening", Icon: Moon });
  }, []);

  // Sync PWA shortcut / deep-link routes to matching phone tab
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/products")) {
      setActiveTab("shop");
    } else if (pathname.startsWith("/subscriptions")) {
      setActiveTab("sub");
    } else if (pathname.startsWith("/orders")) {
      setActiveTab("orders");
    } else if (pathname.startsWith("/profile") || pathname.startsWith("/login")) {
      setActiveTab("account");
      setAuthMode("login");
    } else if (pathname.startsWith("/signup")) {
      setActiveTab("account");
      setAuthMode("signup");
    } else if (pathname.startsWith("/cart") || pathname.startsWith("/checkout")) {
      setCartStep(pathname.startsWith("/checkout") ? "checkout" : "cart");
      setCartOpen(true);
    } else if (pathname.startsWith("/offers")) {
      setOffersOpen(true);
    }
  }, [pathname]);

  // Capture PWA Install
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setIsInstalled(true);
      toast.success("PadmaDairy installed!");
    }
  };

  // Sync user into forms
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setCheckoutAddr((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        street: user.address || prev.street,
      }));
    }
  }, [user]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${getApiUrl()}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            data.map((p: any) => ({
              ...p,
              id: p._id,
              image: p.imageUrl || FALLBACK_IMG,
            }))
          );
          setLoadingProducts(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not reach backend API, showing offline products.");
    }
    setProducts(fallbackProducts);
    setLoadingProducts(false);
  }, []);

  // Fetch orders & subscriptions
  const fetchUserData = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || !isAuthenticated) return;
    setLoadingOrders(true);
    try {
      const [ordersRes, subsRes] = await Promise.all([
        fetch(`${getApiUrl()}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${getApiUrl()}/subscriptions/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (ordersRes.ok) {
        const orderData = await ordersRes.json();
        setOrders(orderData);
        if (orderData.length > 0 && !expandedOrderId) {
          setExpandedOrderId(orderData[0]._id);
        }
      }
      if (subsRes.ok) {
        setSubscriptions(await subsRes.json());
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
    }
    setLoadingOrders(false);
  }, [isAuthenticated, expandedOrderId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setOrders([]);
      setSubscriptions([]);
    }
  }, [isAuthenticated, fetchUserData]);

  // Helpers
  const getCartQty = (productId: string) =>
    items.find((i) => i.id === productId)?.quantity || 0;

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat =
        activeCategory === "All" ||
        p.category?.toLowerCase() === activeCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (sortBy === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  const milkProducts = useMemo(() => {
    const milks = products.filter((p) => p.category?.toLowerCase() === "milk");
    return milks.length > 0 ? milks : products.slice(0, 4);
  }, [products]);

  const deliveryFee = totalPrice >= 300 || totalPrice === 0 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;
  const freeDeliveryRemaining = Math.max(0, 300 - totalPrice);
  const freeDeliveryPct = Math.min(100, Math.round((totalPrice / 300) * 100));
  const currentPlanObj = SUB_PLANS.find((p) => p.id === selectedPlan) || SUB_PLANS[0];

  // Actions
  const handleQuickAdd = async (product: Product, qty = 1) => {
    await addToCart(product, qty);
    toast.success(`${product.name} added to bag`, { duration: 1500 });
  };

  const handleSubscribe = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to start a subscription");
      setActiveTab("account");
      return;
    }
    if (!user?.address) {
      toast.error("Add your delivery address first");
      setEditProfileOpen(true);
      return;
    }

    setSubscribingId(product.id);
    try {
      const token = localStorage.getItem("token");
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const res = await fetch(`${getApiUrl()}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product.id,
          quantity: 1,
          frequency: selectedPlan,
          startDate: startDate.toISOString(),
          shippingAddress: {
            street: user.address,
            city: checkoutAddr.city || "Puri",
            pincode: checkoutAddr.pincode || "752001",
            phone: user.phone || "0000000000",
          },
        }),
      });

      if (res.ok) {
        toast.success(`Subscribed to ${product.name} (${selectedPlan})!`);
        setSelectedProduct(null);
        await fetchUserData();
        setActiveTab("sub");
      } else {
        const err = await res.json();
        toast.error(err.message || "Could not start subscription");
      }
    } catch {
      toast.error("Network error while subscribing");
    }
    setSubscribingId(null);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to place your order");
      setCartOpen(false);
      setActiveTab("account");
      return;
    }
    if (
      !checkoutAddr.name ||
      !checkoutAddr.phone ||
      !checkoutAddr.street ||
      !checkoutAddr.city ||
      !checkoutAddr.pincode
    ) {
      toast.error("Please fill all delivery address fields");
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await fetch(`${getApiUrl()}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            street: checkoutAddr.street,
            city: checkoutAddr.city,
            pincode: checkoutAddr.pincode,
            phone: checkoutAddr.phone,
          },
          paymentMethod:
            paymentMethod === "card"
              ? "Credit Card"
              : paymentMethod === "upi"
              ? "UPI"
              : "Cash on Delivery",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastOrder(data.order);
        setCartStep("success");
        clearCart();
        fetchUserData();
        toast.success("Order placed!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to place order");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setPlacingOrder(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      toast.success("Welcome back!");
      setLoginForm({ email: "", password: "" });
    } else {
      toast.error(result.message || "Invalid credentials");
    }
    setAuthLoading(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setAuthLoading(true);
    const result = await signup(
      signupForm.name,
      signupForm.email,
      signupForm.password,
      signupForm.phone
    );
    if (result.success) {
      toast.success("Account created! Welcome to PadmaDairy");
      setSignupForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    } else {
      toast.error(result.message || "Registration failed");
    }
    setAuthLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const ok = await updateProfile(profileForm);
    if (ok) {
      toast.success("Profile saved");
      setEditProfileOpen(false);
    } else {
      toast.error("Failed to update profile (check 10-digit phone)");
    }
    setSavingProfile(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    toast.success(`Coupon ${code} copied!`);
  };

  const getOrderStepIndex = (status: string) => {
    if (status === "Delivered") return 3;
    if (status === "Out for Delivery") return 2;
    if (status === "Confirmed") return 1;
    return 0;
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#F6F5F0] text-stone-900 select-none pb-32">
      {/* ==================== TOP APP HEADER ==================== */}
      <header className="sticky top-0 z-30 rounded-b-[28px] bg-gradient-to-br from-[#11422C] via-[#195B3D] to-[#23744F] px-4 pt-3 pb-4 text-white shadow-[0_10px_30px_-10px_rgba(17,66,44,0.45)]">
        {/* Top Row: Greeting + Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-200/95">
              <greeting.Icon className="h-3.5 w-3.5 text-amber-300" />
              <span>{greeting.text}</span>
              <span>•</span>
              <span className="truncate font-semibold text-white">PadmaDairy</span>
            </div>
            <button
              type="button"
              onClick={() =>
                isAuthenticated ? setEditProfileOpen(true) : setActiveTab("account")
              }
              className="mt-0.5 flex max-w-full items-center gap-1 text-left active:opacity-75"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-300" />
              <span className="truncate text-sm font-bold tracking-tight text-white">
                {user?.address
                  ? user.address
                  : isAuthenticated
                  ? `Hi ${user?.name?.split(" ")[0]} • Set Address`
                  : "Fresh Delivery by 7 AM"}
              </span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-emerald-200" />
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {installPrompt && !isInstalled && (
              <button
                type="button"
                onClick={handleInstallPwa}
                className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1.5 text-[11px] font-bold text-stone-950 shadow-sm active:scale-95 transition-transform"
              >
                <Download className="h-3.5 w-3.5" />
                Install
              </button>
            )}
            <button
              type="button"
              onClick={() => setOffersOpen(true)}
              aria-label="View offers"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md active:scale-90 transition-transform"
            >
              <Gift className="h-4.5 w-4.5 text-amber-300" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#195B3D]" />
            </button>
          </div>
        </div>

        {/* Integrated Search Bar (Home & Shop) */}
        {(activeTab === "home" || activeTab === "shop") && (
          <div className="mt-3 relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab === "home" && e.target.value.trim().length > 0) {
                  setActiveTab("shop");
                }
              }}
              placeholder="Search pure A2 milk, paneer, ghee..."
              className="w-full rounded-2xl bg-white py-2.5 pl-10 pr-9 text-sm text-stone-800 placeholder:text-stone-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-stone-100 p-1 text-stone-500 active:scale-90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* ==================== TAB 1: HOME ==================== */}
      {activeTab === "home" && (
        <main className="space-y-5 px-4 pt-4">
          {/* Morning Story Hero Card */}
          <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#FFF9EB] via-white to-[#ECFDF3] p-4 shadow-[0_8px_24px_-12px_rgba(17,66,44,0.18)] ring-1 ring-emerald-900/5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 space-y-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  <Sparkles className="h-3 w-3" /> Farm to Home
                </span>
                <h1 className="text-xl font-extrabold leading-tight tracking-tight text-stone-900">
                  Pure Morning Milk,{" "}
                  <span className="text-[#195B3D]">Delivered Chilled.</span>
                </h1>
                <p className="text-xs leading-relaxed text-stone-500">
                  Zero preservatives. Order before 10 PM for 7 AM doorstep drop.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("sub")}
                    className="rounded-xl bg-[#195B3D] px-3.5 py-2 text-xs font-bold text-white shadow-sm active:scale-95 transition-transform"
                  >
                    Milk Pass • 15% Off
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("shop")}
                    className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700 active:scale-95 transition-transform"
                  >
                    Shop All
                  </button>
                </div>
              </div>
              <div className="relative h-28 w-28 shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-200/50 blur-lg" />
                <img
                  src="/hero-dairy.jpg"
                  alt="Farm Fresh Dairy"
                  className="relative h-28 w-28 rounded-[22px] object-cover shadow-md ring-2 ring-white"
                />
              </div>
            </div>
          </section>

          {/* Story-Style Category Bubbles */}
          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-sm font-extrabold tracking-tight text-stone-800">
                Fresh Aisles
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setActiveTab("shop");
                }}
                className="text-xs font-semibold text-[#195B3D]"
              >
                See all
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              {categories
                .filter((c) => c !== "All")
                .map((cat) => {
                  const meta = CATEGORY_META[cat] || CATEGORY_META.All;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat);
                        setActiveTab("shop");
                      }}
                      className="flex shrink-0 flex-col items-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-[20px] ${meta.bg} text-2xl shadow-sm ring-1 ${meta.ring}`}
                      >
                        {meta.emoji}
                      </div>
                      <span className="max-w-[68px] truncate text-[11px] font-semibold text-stone-700">
                        {cat}
                      </span>
                    </button>
                  );
                })}
            </div>
          </section>

          {/* Swipeable Deals Strip */}
          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-extrabold tracking-tight text-stone-800">
                  Today&apos;s Deals
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOffersOpen(true)}
                className="text-xs font-semibold text-[#195B3D]"
              >
                All coupons
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              {offers.map((offer, idx) => (
                <div
                  key={offer.id}
                  onClick={() => copyCode(offer.code)}
                  className={`flex w-64 shrink-0 cursor-pointer items-center justify-between rounded-2xl p-3.5 text-white shadow-sm active:scale-[0.98] transition-transform ${
                    idx % 2 === 0
                      ? "bg-gradient-to-r from-[#14532D] to-[#1E7A46]"
                      : "bg-gradient-to-r from-amber-500 to-orange-500"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      Tap to Copy
                    </p>
                    <p className="truncate text-sm font-extrabold">{offer.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-white/90">
                      {offer.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-center rounded-xl bg-white/20 px-2.5 py-1.5 backdrop-blur-sm">
                    <span className="font-mono text-xs font-extrabold">{offer.code}</span>
                    <Copy className="mt-0.5 h-3 w-3 opacity-80" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Morning Essentials 2-Col Quick Grid */}
          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold tracking-tight text-stone-800">
                  Morning Essentials
                </h2>
                <p className="text-[11px] text-stone-500">Tap + for instant bag add</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setActiveTab("shop");
                }}
                className="flex items-center gap-0.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#195B3D] shadow-sm ring-1 ring-stone-200/70"
              >
                Explore <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-56 animate-pulse rounded-3xl bg-white p-3 shadow-sm"
                  >
                    <div className="h-28 rounded-2xl bg-stone-200" />
                    <div className="mt-3 h-3 w-3/4 rounded bg-stone-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-stone-100" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {products.slice(0, 6).map((product) => {
                  const qty = getCartQty(product.id);
                  return (
                    <div
                      key={product.id}
                      className="flex flex-col overflow-hidden rounded-[22px] bg-white p-2.5 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] ring-1 ring-stone-200/60"
                    >
                      <div
                        onClick={() => {
                          setSelectedProduct(product);
                          setDetailQty(1);
                        }}
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 cursor-pointer"
                      >
                        <img
                          src={product.image || FALLBACK_IMG}
                          alt={product.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                          }}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-stone-700 backdrop-blur-sm">
                          {product.unit}
                        </span>
                      </div>

                      <div
                        onClick={() => {
                          setSelectedProduct(product);
                          setDetailQty(1);
                        }}
                        className="mt-2 flex-1 cursor-pointer"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          {product.category}
                        </p>
                        <h3 className="line-clamp-1 text-[13px] font-bold text-stone-900">
                          {product.name}
                        </h3>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-1">
                        <span className="text-base font-extrabold text-stone-900">
                          ₹{product.price}
                        </span>

                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product, 1)}
                            className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-[#195B3D] ring-1 ring-emerald-600/30 active:scale-95 transition-transform"
                          >
                            <Plus className="h-3.5 w-3.5" /> ADD
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 rounded-xl bg-[#195B3D] px-1.5 py-1 text-white shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, qty - 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/15 active:scale-90"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[16px] text-center text-xs font-extrabold">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, qty + 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/15 active:scale-90"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Compact Trust Strip */}
          <section className="grid grid-cols-2 gap-2.5 pb-2">
            {[
              { icon: Truck, title: "Free Delivery", sub: "Orders above ₹300" },
              { icon: Clock, title: "7 AM Drop", sub: "Chilled morning milk" },
              { icon: ShieldCheck, title: "100% Pure", sub: "Lab tested daily" },
              { icon: Leaf, title: "Local Farms", sub: "Direct sourcing" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-xs ring-1 ring-stone-200/60"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#195B3D]">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-stone-900">{item.title}</p>
                  <p className="truncate text-[10px] text-stone-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </section>
        </main>
      )}

      {/* ==================== TAB 2: SHOP ==================== */}
      {activeTab === "shop" && (
        <main className="px-4 pt-3 space-y-3.5">
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              const meta = CATEGORY_META[cat] || CATEGORY_META.All;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all active:scale-95 ${
                    active
                      ? "bg-[#195B3D] text-white shadow-sm"
                      : "bg-white text-stone-700 ring-1 ring-stone-200"
                  }`}
                >
                  <span>{meta.emoji}</span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Sort & Count Bar */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-stone-500">
              {filteredProducts.length} fresh item{filteredProducts.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-1 rounded-xl bg-white p-1 ring-1 ring-stone-200/80">
              {(
                [
                  { id: "default", label: "Popular" },
                  { id: "low", label: "₹ Low" },
                  { id: "high", label: "₹ High" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                    sortBy === opt.id
                      ? "bg-emerald-100 text-[#195B3D]"
                      : "text-stone-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-xs">
              <Milk className="mx-auto h-10 w-10 text-stone-300" />
              <p className="mt-3 text-sm font-bold text-stone-700">No dairy items found</p>
              <p className="mt-1 text-xs text-stone-500">
                Try clearing your search or choosing another aisle.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 rounded-xl bg-[#195B3D] px-4 py-2 text-xs font-bold text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-2">
              {filteredProducts.map((product) => {
                const qty = getCartQty(product.id);
                return (
                  <div
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-[22px] bg-white p-2.5 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] ring-1 ring-stone-200/60"
                  >
                    <div
                      onClick={() => {
                        setSelectedProduct(product);
                        setDetailQty(1);
                      }}
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 cursor-pointer"
                    >
                      <img
                        src={product.image || FALLBACK_IMG}
                        alt={product.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                        }}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                        {product.unit}
                      </span>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedProduct(product);
                        setDetailQty(1);
                      }}
                      className="mt-2 flex-1 cursor-pointer"
                    >
                      <p className="text-[10px] font-semibold uppercase text-emerald-700">
                        {product.category}
                      </p>
                      <h3 className="line-clamp-1 text-[13px] font-bold text-stone-900">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-400">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-base font-extrabold text-stone-900">
                        ₹{product.price}
                      </span>
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(product, 1)}
                          className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-[#195B3D] ring-1 ring-emerald-600/30 active:scale-95 transition-transform"
                        >
                          <Plus className="h-3.5 w-3.5" /> ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-xl bg-[#195B3D] px-1.5 py-1 text-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/15 active:scale-90"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[16px] text-center text-xs font-extrabold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, qty + 1)}
                            className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/15 active:scale-90"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ==================== TAB 3: SUBSCRIPTIONS ==================== */}
      {activeTab === "sub" && (
        <main className="space-y-4 px-4 pt-4">
          {/* Morning Pass Banner */}
          <div className="rounded-[26px] bg-gradient-to-br from-[#11422C] to-[#23744F] p-5 text-white shadow-md">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-stone-950">
              <CalendarClock className="h-3 w-3" /> Morning Milk Pass
            </span>
            <h2 className="mt-2 text-xl font-extrabold">
              Auto-Delivered Fresh Every Morning
            </h2>
            <p className="mt-1 text-xs text-emerald-100">
              Save up to 15% with free doorstep delivery. Pause or skip anytime.
            </p>

            {/* Plan Segmented Selector */}
            <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-black/20 p-1.5">
              {SUB_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`rounded-xl py-2 text-center transition-all ${
                    selectedPlan === plan.id
                      ? "bg-white text-[#11422C] shadow-sm"
                      : "text-emerald-100"
                  }`}
                >
                  <p className="text-xs font-extrabold">{plan.name}</p>
                  <p
                    className={`text-[10px] font-bold ${
                      selectedPlan === plan.id ? "text-emerald-600" : "text-amber-300"
                    }`}
                  >
                    {plan.badge}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-1.5 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              {currentPlanObj.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2 text-xs text-emerald-50">
                  <Check className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Subscriptions */}
          {isAuthenticated && subscriptions.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-stone-800">
                Your Active Plans ({subscriptions.length})
              </h3>
              {subscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-xs ring-1 ring-emerald-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#195B3D]">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">
                        {sub.product?.name || "Dairy Subscription"}
                      </p>
                      <p className="text-xs capitalize text-stone-500">
                        {sub.frequency} • Qty {sub.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    {sub.status || "Active"}
                  </span>
                </div>
              ))}
            </section>
          )}

          {/* Subscribe Products */}
          <section className="space-y-2.5">
            <h3 className="text-sm font-extrabold text-stone-800">
              Start a {currentPlanObj.name} Subscription
            </h3>
            <div className="space-y-2.5">
              {milkProducts.map((product) => {
                const discounted = Math.round(
                  product.price * (1 - currentPlanObj.discount / 100)
                );
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xs ring-1 ring-stone-200/70"
                  >
                    <img
                      src={product.image || FALLBACK_IMG}
                      alt={product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover bg-stone-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-stone-900">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-stone-500">{product.unit}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-sm font-extrabold text-[#195B3D]">
                          ₹{discounted}
                        </span>
                        <span className="text-xs text-stone-400 line-through">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={subscribingId === product.id}
                      onClick={() => handleSubscribe(product)}
                      className="shrink-0 rounded-xl bg-[#195B3D] px-3.5 py-2 text-xs font-bold text-white shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {subscribingId === product.id ? "..." : "Subscribe"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* ==================== TAB 4: ORDERS ==================== */}
      {activeTab === "orders" && (
        <main className="space-y-4 px-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-stone-900">My Orders</h2>
              <p className="text-xs text-stone-500">Live delivery status & history</p>
            </div>
            {isAuthenticated && (
              <button
                type="button"
                onClick={fetchUserData}
                className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-stone-700 shadow-xs ring-1 ring-stone-200 active:scale-95"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingOrders ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-xs ring-1 ring-stone-200/70">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#195B3D]">
                <Package className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-base font-extrabold text-stone-900">
                Sign in to Track Orders
              </h3>
              <p className="mt-1 text-xs text-stone-500">
                See real-time delivery steps and reorder your favorites in one tap.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className="mt-4 w-full rounded-2xl bg-[#195B3D] py-3 text-sm font-bold text-white active:scale-[0.98]"
              >
                Sign In / Create Account
              </button>
            </div>
          ) : loadingOrders ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 animate-pulse rounded-3xl bg-white p-4" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-xs">
              <ShoppingBag className="mx-auto h-10 w-10 text-stone-300" />
              <p className="mt-3 text-sm font-bold text-stone-800">No orders yet</p>
              <p className="mt-1 text-xs text-stone-500">
                Your fresh dairy orders will appear here.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("shop")}
                className="mt-4 rounded-2xl bg-[#195B3D] px-5 py-2.5 text-xs font-bold text-white"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order._id;
                const isCancelled = order.status === "Cancelled";
                const stepIdx = getOrderStepIndex(order.status || "Pending");
                const steps = ["Placed", "Confirmed", "On Way", "Delivered"];

                return (
                  <div
                    key={order._id}
                    className="overflow-hidden rounded-[24px] bg-white p-4 shadow-xs ring-1 ring-stone-200/70"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order._id)
                      }
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : isCancelled
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status === "Delivered" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : isCancelled ? (
                            <XCircle className="h-5 w-5" />
                          ) : (
                            <Truck className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono text-sm font-extrabold text-stone-900">
                            ORD{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {new Date(order.createdAt).toLocaleDateString()} •{" "}
                            {order.orderItems?.length || 0} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : isCancelled
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                        <p className="mt-1 text-sm font-extrabold text-stone-900">
                          ₹{order.totalPrice}
                        </p>
                      </div>
                    </button>

                    {/* Live Tracker Dots */}
                    {!isCancelled && (
                      <div className="mt-4">
                        <div className="relative flex items-center justify-between">
                          <div className="absolute left-3 right-3 top-2.5 h-1 rounded-full bg-stone-200" />
                          <div
                            className="absolute left-3 top-2.5 h-1 rounded-full bg-[#195B3D] transition-all duration-500"
                            style={{ width: `calc(${(stepIdx / 3) * 100}% - 12px)` }}
                          />
                          {steps.map((label, idx) => (
                            <div
                              key={label}
                              className="relative z-10 flex flex-col items-center gap-1"
                            >
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                  idx <= stepIdx
                                    ? "bg-[#195B3D] text-white ring-4 ring-emerald-50"
                                    : "bg-stone-200 text-stone-500"
                                }`}
                              >
                                {idx <= stepIdx ? <Check className="h-3 w-3" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] font-semibold ${
                                  idx <= stepIdx ? "text-stone-900" : "text-stone-400"
                                }`}
                              >
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 space-y-2.5 border-t border-stone-100 pt-3">
                        <div className="space-y-1.5">
                          {order.orderItems?.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-stone-700">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-bold text-stone-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl bg-stone-50 p-2.5 text-[11px] text-stone-600">
                          <p className="font-semibold text-stone-800">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city} -{" "}
                            {order.shippingAddress?.pincode}
                          </p>
                          <p className="mt-0.5">
                            Payment: {order.paymentMethod} • Phone:{" "}
                            {order.shippingAddress?.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ==================== TAB 5: ACCOUNT ==================== */}
      {activeTab === "account" && (
        <main className="space-y-4 px-4 pt-4">
          {!isAuthenticated ? (
            <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#195B3D] text-white shadow-sm">
                  <Milk className="h-6 w-6" />
                </div>
                <h2 className="mt-3 text-xl font-extrabold text-stone-900">
                  {authMode === "login" ? "Welcome Back" : "Join PadmaDairy"}
                </h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  {authMode === "login"
                    ? "Sign in to manage orders & morning milk"
                    : "Create your account in 30 seconds"}
                </p>
              </div>

              {/* Segmented Toggle */}
              <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    authMode === "login"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    authMode === "signup"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authMode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">Email</label>
                    <input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700">Password</label>
                    <div className="relative mt-1">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, password: e.target.value })
                        }
                        placeholder="Enter password"
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 pr-10 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                      >
                        {showPass ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-2xl bg-[#195B3D] py-3 text-sm font-extrabold text-white shadow-sm active:scale-[0.98] disabled:opacity-60"
                  >
                    {authLoading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, name: e.target.value })
                      }
                      placeholder="Your full name"
                      className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700">Email</label>
                    <input
                      type="email"
                      required
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700">
                      Phone Number (10 digits)
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="\d{10}"
                      maxLength={10}
                      value={signupForm.phone}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="9876543210"
                      className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-stone-700">Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, password: e.target.value })
                        }
                        placeholder="Min 6 chars"
                        className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700">Confirm</label>
                      <input
                        type="password"
                        required
                        value={signupForm.confirmPassword}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Repeat"
                        className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-2xl bg-[#195B3D] py-3 text-sm font-extrabold text-white shadow-sm active:scale-[0.98] disabled:opacity-60"
                  >
                    {authLoading ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Member Hero Card */}
              <div className="rounded-[28px] bg-gradient-to-br from-[#11422C] to-[#23744F] p-5 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-stone-950 shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-extrabold">{user?.name}</h2>
                      <p className="truncate text-xs text-emerald-100">{user?.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                        {user?.role || "Customer"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditProfileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 active:scale-90"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-black/20 p-2.5 text-center">
                  <div>
                    <p className="text-lg font-extrabold">{orders.length}</p>
                    <p className="text-[10px] text-emerald-200">Orders</p>
                  </div>
                  <div className="border-x border-white/15">
                    <p className="text-lg font-extrabold">{subscriptions.length}</p>
                    <p className="text-[10px] text-emerald-200">Active Subs</p>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold">{totalItems}</p>
                    <p className="text-[10px] text-emerald-200">In Bag</p>
                  </div>
                </div>
              </div>

              {/* Native Settings Menu */}
              <div className="overflow-hidden rounded-[24px] bg-white shadow-xs ring-1 ring-stone-200/70 divide-y divide-stone-100">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(true)}
                  className="flex w-full items-center justify-between p-4 active:bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#195B3D]">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-stone-900">
                        Profile & Delivery Address
                      </p>
                      <p className="max-w-[200px] truncate text-xs text-stone-500">
                        {user?.address || "Tap to add your delivery address"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="flex w-full items-center justify-between p-4 active:bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                      <Package className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-stone-900">Order History</p>
                      <p className="text-xs text-stone-500">Track active deliveries</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setOffersOpen(true)}
                  className="flex w-full items-center justify-between p-4 active:bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Tag className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-stone-900">Coupons & Offers</p>
                      <p className="text-xs text-stone-500">
                        {offers.length} active codes available
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-stone-400" />
                </button>

                {user?.role === "admin" && (
                  <a
                    href="/admin"
                    className="flex w-full items-center justify-between p-4 active:bg-stone-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                        <Settings className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-stone-900">Admin Dashboard</p>
                        <p className="text-xs text-stone-500">
                          Manage store orders & inventory
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-stone-400" />
                  </a>
                )}
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  toast.success("Logged out");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-extrabold text-red-600 ring-1 ring-red-200/70 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </>
          )}
        </main>
      )}

      {/* ==================== FLOATING CART PILL ==================== */}
      {totalItems > 0 && !cartOpen && (
        <div className="fixed bottom-[82px] left-4 right-4 z-30">
          <button
            type="button"
            onClick={() => {
              setCartStep("cart");
              setCartOpen(true);
            }}
            className="flex w-full items-center justify-between rounded-2xl bg-[#11422C] px-4 py-3 text-white shadow-[0_12px_28px_-6px_rgba(17,66,44,0.65)] ring-1 ring-emerald-400/30 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-stone-950 font-black text-sm">
                {totalItems}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-medium text-emerald-200">
                  {totalItems} item{totalItems > 1 ? "s" : ""} in bag
                </p>
                <p className="text-sm font-extrabold">₹{totalPrice}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-extrabold">
              <span>View Cart</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      {/* ==================== FLOATING GLASS BOTTOM NAV ==================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200/80 bg-white/90 px-2 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur-xl shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.12)]">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {(
            [
              { id: "home", label: "Home", icon: Home },
              { id: "shop", label: "Shop", icon: Store },
              { id: "sub", label: "Milk Pass", icon: CalendarClock },
              { id: "orders", label: "Orders", icon: Package },
              { id: "account", label: "Account", icon: User },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-0.5 py-0.5 active:scale-90 transition-transform"
              >
                <div
                  className={`flex h-8 w-12 items-center justify-center rounded-2xl transition-all ${
                    active
                      ? "bg-[#195B3D] text-white shadow-sm"
                      : "text-stone-400"
                  }`}
                >
                  <tab.icon className="h-4.5 w-4.5" />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    active ? "text-[#195B3D]" : "text-stone-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ==================== PRODUCT DETAIL BOTTOM SHEET ==================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-[2px]">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative z-10 w-full max-h-[88dvh] overflow-y-auto rounded-t-[32px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-200" />
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-stone-100">
              <img
                src={selectedProduct.image || FALLBACK_IMG}
                alt={selectedProduct.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                }}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#195B3D]">
                {selectedProduct.category}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-extrabold text-stone-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs font-semibold text-stone-500">
                    Pack size: {selectedProduct.unit}
                  </p>
                </div>
                <p className="text-2xl font-black text-[#195B3D]">
                  ₹{selectedProduct.price}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {selectedProduct.description}
              </p>

              {/* Quantity Picker */}
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-stone-50 p-3">
                <span className="text-xs font-bold text-stone-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-stone-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-extrabold">
                    {detailQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetailQty(detailQty + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-stone-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSubscribe(selectedProduct)}
                  className="rounded-2xl border-2 border-[#195B3D] py-3 text-xs font-extrabold text-[#195B3D] active:scale-[0.98]"
                >
                  Subscribe (15% Off)
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleQuickAdd(selectedProduct, detailQty);
                    setSelectedProduct(null);
                  }}
                  className="rounded-2xl bg-[#195B3D] py-3 text-xs font-extrabold text-white shadow-sm active:scale-[0.98]"
                >
                  Add • ₹{selectedProduct.price * detailQty}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CART & EXPRESS CHECKOUT SHEET ==================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-[2px]">
          <div className="fixed inset-0" onClick={() => setCartOpen(false)} />
          <div className="relative z-10 flex max-h-[90dvh] w-full flex-col rounded-t-[32px] bg-[#F6F5F0] shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between rounded-t-[32px] bg-white px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                {cartStep === "checkout" && (
                  <button
                    type="button"
                    onClick={() => setCartStep("cart")}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <h3 className="text-base font-extrabold text-stone-900">
                  {cartStep === "cart"
                    ? `Your Bag (${totalItems})`
                    : cartStep === "checkout"
                    ? "Express Checkout"
                    : "Order Confirmed"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartStep === "cart" && (
                <>
                  {/* Free Delivery Meter */}
                  <div className="rounded-2xl bg-white p-3.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-700">
                        {freeDeliveryRemaining === 0
                          ? "🎉 Free Delivery Unlocked!"
                          : `Add ₹${freeDeliveryRemaining} more for FREE delivery`}
                      </span>
                      <span className="text-[#195B3D]">{freeDeliveryPct}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#195B3D] transition-all duration-300"
                        style={{ width: `${freeDeliveryPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xs"
                      >
                        <img
                          src={item.image || FALLBACK_IMG}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                          }}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover bg-stone-100"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-stone-900">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            ₹{item.price} • {item.unit}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-1.5 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-0.5 text-stone-700"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-xs font-extrabold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-0.5 text-stone-700"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-stone-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-extrabold text-stone-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Bill Breakdown */}
                  <div className="rounded-2xl bg-white p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-stone-900">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-[#195B3D]">
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-extrabold text-stone-900">
                      <span>To Pay</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>
                </>
              )}

              {cartStep === "checkout" && (
                <>
                  <div className="rounded-2xl bg-white p-4 space-y-3">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                      Delivery Details
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={checkoutAddr.name}
                        onChange={(e) =>
                          setCheckoutAddr({ ...checkoutAddr, name: e.target.value })
                        }
                        className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-[#195B3D] focus:bg-white focus:outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={checkoutAddr.phone}
                        onChange={(e) =>
                          setCheckoutAddr({ ...checkoutAddr, phone: e.target.value })
                        }
                        className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-[#195B3D] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="House / Street / Landmark"
                      value={checkoutAddr.street}
                      onChange={(e) =>
                        setCheckoutAddr({ ...checkoutAddr, street: e.target.value })
                      }
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-[#195B3D] focus:bg-white focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        value={checkoutAddr.city}
                        onChange={(e) =>
                          setCheckoutAddr({ ...checkoutAddr, city: e.target.value })
                        }
                        className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-[#195B3D] focus:bg-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="PIN Code"
                        value={checkoutAddr.pincode}
                        onChange={(e) =>
                          setCheckoutAddr({ ...checkoutAddr, pincode: e.target.value })
                        }
                        className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-[#195B3D] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 space-y-2.5">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                      Payment Method
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: "upi", label: "UPI", icon: Wallet },
                          { id: "card", label: "Card", icon: CreditCard },
                          { id: "cod", label: "Cash", icon: Banknote },
                        ] as const
                      ).map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
                            paymentMethod === pm.id
                              ? "border-[#195B3D] bg-emerald-50 text-[#195B3D]"
                              : "border-stone-200 text-stone-600"
                          }`}
                        >
                          <pm.icon className="h-5 w-5" />
                          <span className="text-xs font-bold">{pm.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {cartStep === "success" && (
                <div className="rounded-3xl bg-white p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#195B3D]">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h4 className="mt-3 text-xl font-extrabold text-stone-900">
                    Order Confirmed!
                  </h4>
                  <p className="mt-1 text-xs text-stone-500">
                    Fresh dairy is being packed for doorstep delivery.
                  </p>
                  {lastOrder && (
                    <div className="mt-4 rounded-2xl bg-stone-50 p-3.5 text-left text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Order ID</span>
                        <span className="font-mono font-extrabold">
                          ORD{lastOrder._id?.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Total</span>
                        <span className="font-extrabold text-[#195B3D]">
                          ₹{lastOrder.totalPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Payment</span>
                        <span className="font-bold">{lastOrder.paymentMethod}</span>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      setCartStep("cart");
                      setActiveTab("orders");
                    }}
                    className="mt-5 w-full rounded-2xl bg-[#195B3D] py-3 text-sm font-extrabold text-white"
                  >
                    Track My Order
                  </button>
                </div>
              )}
            </div>

            {/* Sticky Bottom CTA */}
            {cartStep !== "success" && (
              <div className="border-t border-stone-200 bg-white px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {cartStep === "cart" ? (
                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={() => setCartStep("checkout")}
                    className="flex w-full items-center justify-between rounded-2xl bg-[#195B3D] px-5 py-3.5 text-sm font-extrabold text-white shadow-md active:scale-[0.98] disabled:opacity-50"
                  >
                    <span>Proceed to Checkout</span>
                    <span>₹{finalTotal} →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={placingOrder}
                    onClick={handlePlaceOrder}
                    className="w-full rounded-2xl bg-[#195B3D] py-3.5 text-sm font-extrabold text-white shadow-md active:scale-[0.98] disabled:opacity-50"
                  >
                    {placingOrder
                      ? "Placing Order..."
                      : paymentMethod === "cod"
                      ? `Place Order (COD) • ₹${finalTotal}`
                      : `Pay & Place Order • ₹${finalTotal}`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== OFFERS SHEET ==================== */}
      {offersOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-[2px]">
          <div className="fixed inset-0" onClick={() => setOffersOpen(false)} />
          <div className="relative z-10 w-full max-h-[80dvh] overflow-y-auto rounded-t-[32px] bg-[#F6F5F0] p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-stone-900">
                Available Coupons
              </h3>
              <button
                type="button"
                onClick={() => setOffersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-xs ring-1 ring-stone-200/70"
                >
                  <div className="pr-3">
                    <p className="text-sm font-extrabold text-stone-900">{offer.title}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{offer.description}</p>
                    {offer.minOrder > 0 && (
                      <p className="mt-1 text-[10px] font-semibold text-amber-600">
                        Min order ₹{offer.minOrder}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(offer.code)}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-dashed border-[#195B3D] bg-emerald-50 px-3 py-2 font-mono text-xs font-extrabold text-[#195B3D] active:scale-95"
                  >
                    {offer.code} <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT PROFILE / ADDRESS SHEET ==================== */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-[2px]">
          <div className="fixed inset-0" onClick={() => setEditProfileOpen(false)} />
          <div className="relative z-10 w-full rounded-t-[32px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-stone-900">
                Edit Profile & Address
              </h3>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700">
                  Phone (10 digits)
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  placeholder="House no, street, landmark, city..."
                  className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-[#195B3D] focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full rounded-2xl bg-[#195B3D] py-3 text-sm font-extrabold text-white active:scale-[0.98] disabled:opacity-60"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
