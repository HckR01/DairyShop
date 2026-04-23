"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Truck, Clock, Shield, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { offers } from "@/lib/products"
import { Product } from "@/contexts/cart-context"

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free delivery on orders above Rs.300",
  },
  {
    icon: Clock,
    title: "Fresh Daily",
    description: "Products delivered fresh every morning",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "100% pure and hygienic products",
  },
  {
    icon: Leaf,
    title: "Farm Fresh",
    description: "Directly sourced from local farms",
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const featuredOffer = offers[0]

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            const formattedProducts = data.map((p: any) => ({
              ...p,
              id: p._id,
              image: p.imageUrl || "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop"
            }))
            setFeaturedProducts(formattedProducts.slice(0, 4))
          }
        }
      } catch (err) {
        console.error("Failed to fetch featured products", err)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="text-center md:text-left">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                Farm Fresh Dairy Delivered to Your Door
              </h1>
              <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
                Experience the taste of pure, fresh dairy products sourced
                directly from local farms. Subscribe for daily, weekly, or
                monthly deliveries.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start sm:gap-4">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/subscriptions" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Start Subscription
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm md:max-w-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-56 w-56 rounded-full bg-primary/20 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96">
                  <Image
                    src="/hero-dairy.jpg"
                    alt="Fresh dairy products"
                    fill
                    className="rounded-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left md:flex-col md:text-center"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-12 sm:w-12">
                  <feature.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold sm:text-base">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
                Featured Products
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Our most popular dairy products
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">Loading featured products...</p>
            )}
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="bg-primary py-8 text-primary-foreground sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
                {featuredOffer.title}
              </h2>
              <p className="mt-1 text-sm text-primary-foreground/80 sm:text-base">
                {featuredOffer.description}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="rounded-lg bg-primary-foreground/20 px-4 py-2">
                <span className="font-mono text-base font-bold sm:text-lg">
                  {featuredOffer.code}
                </span>
              </div>
              <Link href="/offers" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">View All Offers</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto md:min-h-[300px]">
                <Image
                  src="/subscription-banner.jpg"
                  alt="Dairy subscription"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="flex flex-col justify-center p-5 sm:p-8">
                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
                  Subscribe & Save
                </h2>
                <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
                  Never run out of your daily essentials. Subscribe to our dairy
                  products and get them delivered fresh at your doorstep. Choose
                  from daily, weekly, or monthly delivery options.
                </p>
                <ul className="mt-4 space-y-2 text-xs sm:mt-6 sm:text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    15% off on all subscription orders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    Flexible delivery schedules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    Pause or cancel anytime
                  </li>
                </ul>
                <div className="mt-6 sm:mt-8">
                  <Link href="/subscriptions" className="block sm:inline-block">
                    <Button size="lg" className="w-full gap-2 sm:w-auto">
                      Start Subscription <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
