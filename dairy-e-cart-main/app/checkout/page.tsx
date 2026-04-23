"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CreditCard, Wallet, Building2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Pay securely with your card",
  },
  {
    id: "upi",
    name: "UPI",
    icon: Wallet,
    description: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: Building2,
    description: "Pay through your bank",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: Wallet,
    description: "Pay when you receive",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  })

  const deliveryFee = totalPrice >= 300 ? 0 : 40
  const finalTotal = totalPrice + deliveryFee

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      toast.error("Please fill in all address fields")
      return
    }

    if (!isAuthenticated) {
      toast.error("Please login to place an order")
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          shippingAddress: {
            street: address.street,
            city: address.city,
            pincode: address.pincode,
            phone: address.phone
          },
          paymentMethod: paymentMethod === "card" ? "Credit Card" : (paymentMethod === "upi" ? "UPI" : "Cash on Delivery")
        })
      })

      if (res.ok) {
        const data = await res.json()
        setOrderDetails(data.order)
        setOrderPlaced(true)
        clearCart()
      } else {
        const data = await res.json()
        toast.error(data.message || "Failed to place order")
      }
    } catch (error) {
      console.error("Order failed", error)
      toast.error("Something went wrong")
    }

    setLoading(false)
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-8">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
            <p className="mt-2 text-muted-foreground">
              Your order has been placed and will be delivered soon.
            </p>
            <div className="mt-6 rounded-lg bg-muted p-4 text-left text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-medium">ORD{orderDetails._id?.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">{orderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Total Paid:</span>
                <span className="font-medium">Rs.{orderDetails.totalPrice}</span>
              </div>
              <div className="pt-2">
                <span className="block text-muted-foreground">Deliver To:</span>
                <span className="block font-medium mt-1">
                  {orderDetails.shippingAddress?.street}, {orderDetails.shippingAddress?.city} - {orderDetails.shippingAddress?.pincode}
                </span>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => router.push("/profile")}>
                Track Order
              </Button>
              <Button variant="outline" onClick={() => router.push("/products")}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
                <CardDescription>
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={address.name}
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    placeholder="123 Main Street, Apartment 4B"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    placeholder="Maharashtra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                    placeholder="400001"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose how you want to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid gap-3 sm:gap-4 md:grid-cols-2"
                >
                  {paymentMethods.map((method) => (
                    <Label
                      key={method.id}
                      htmlFor={method.id}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-primary sm:gap-4 sm:p-4",
                          paymentMethod === method.id && "border-2 border-primary"
                        )}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                          <method.icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium sm:text-base">{method.name}</p>
                          <p className="truncate text-xs text-muted-foreground sm:text-sm">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4 rounded-lg border p-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="mt-6 space-y-4 rounded-lg border p-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input id="upiId" placeholder="yourname@upi" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-48 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        Rs.{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
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
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs.{finalTotal}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : paymentMethod === "cod" ? "Place Order (Cash on Delivery)" : `Pay Rs.${finalTotal}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
