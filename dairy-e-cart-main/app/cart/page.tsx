"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { toast } from "sonner"

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    addSubscription,
    removeSubscription,
    totalPrice,
  } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const deliveryFee = totalPrice >= 300 ? 0 : 40
  const finalTotal = totalPrice + deliveryFee

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "FIRST20") {
      toast.success("Promo code applied! 20% discount added.")
    } else {
      toast.error("Invalid promo code")
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Add some delicious dairy products to get started!
          </p>
          <Link href="/products">
            <Button className="mt-6 gap-2">
              Browse Products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-3 sm:flex-row sm:p-4">
                    <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted sm:mx-0 sm:h-24 sm:w-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.unit}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="font-semibold">
                          Rs.{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Subscription Option */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.subscription ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.subscription.frequency}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => removeSubscription(item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <Select
                            onValueChange={(value) =>
                              addSubscription(
                                item.id,
                                value as "daily" | "weekly" | "monthly",
                                new Date().toISOString()
                              )
                            }
                          >
                            <SelectTrigger className="h-8 w-full text-xs sm:w-40">
                              <SelectValue placeholder="Subscribe & Save" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily Delivery</SelectItem>
                              <SelectItem value="weekly">Weekly Delivery</SelectItem>
                              <SelectItem value="monthly">Monthly Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs.{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-primary">FREE</span>
                      ) : (
                        `Rs.${deliveryFee}`
                      )}
                    </span>
                  </div>
                  {totalPrice < 300 && (
                    <p className="text-xs text-muted-foreground">
                      Add Rs.{300 - totalPrice} more for free delivery
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs.{finalTotal}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full gap-2">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
