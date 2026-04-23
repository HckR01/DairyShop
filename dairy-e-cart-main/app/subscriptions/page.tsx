"use client"

import { useState,useEffect } from "react"
import { Check, Calendar, Truck, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ProductCard } from "@/components/product-card"
import { Product } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

const subscriptionPlans = [
  {
    id: "daily",
    name: "Daily Delivery",
    description: "Fresh products delivered every morning",
    discount: 15,
    features: [
      "Morning delivery before 7 AM",
      "Skip any day easily",
      "15% discount on all products",
      "Priority customer support",
    ],
  },
  {
    id: "weekly",
    name: "Weekly Delivery",
    description: "Stock up once a week",
    discount: 10,
    features: [
      "Choose your delivery day",
      "10% discount on all products",
      "Flexible quantity changes",
      "Easy rescheduling",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Delivery",
    description: "Bulk monthly supplies",
    discount: 5,
    features: [
      "Best for bulk buying",
      "5% discount on all products",
      "Free delivery guaranteed",
      "30-day money back guarantee",
    ],
  },
]

export default function SubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState("daily")
  const [milkProducts, setMilkProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
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
            // Filter only Milk category and take a few
            setMilkProducts(formattedProducts.filter((p: Product) => p.category === "Milk").slice(0, 4))
          }
        }
      } catch (err) {
        console.error("Failed to fetch products:", err)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4">Save up to 15%</Badge>
          <h1 className="text-3xl font-bold md:text-4xl">
            Subscribe & Save
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Never run out of your daily dairy essentials. Choose a subscription
            plan that fits your lifestyle and enjoy fresh products delivered
            straight to your door.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12 grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Save Money</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get up to 15% discount on all subscription orders
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Free Delivery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                All subscription orders get free delivery
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Flexible Schedule</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pause, skip, or cancel your subscription anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Choose Your Plan
          </h2>
          <RadioGroup
            value={selectedPlan}
            onValueChange={setSelectedPlan}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {subscriptionPlans.map((plan) => (
              <Label key={plan.id} htmlFor={plan.id} className="cursor-pointer">
                <Card
                  className={cn(
                    "transition-all hover:border-primary",
                    selectedPlan === plan.id && "border-2 border-primary"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <RadioGroupItem value={plan.id} id={plan.id} />
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Badge variant="secondary" className="text-lg">
                        {plan.discount}% OFF
                      </Badge>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Popular Subscription Products */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            Popular Subscription Products
          </h2>
          <p className="mb-6 text-muted-foreground">
            These products are most popular among our subscribers
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milkProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
