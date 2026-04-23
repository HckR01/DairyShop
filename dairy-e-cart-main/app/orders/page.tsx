"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronDown, ChevronUp, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
          if (data.length > 0) setExpandedOrder(data[0]._id)
        }
      } catch (error) {
        console.error("Failed to fetch orders", error)
      }
      setLoading(false)
    }

    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be logged in to view your orders
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTracking = (status: string, createdAt: string) => {
    const isCancelled = status === "Cancelled";
    
    const steps = [
      { title: "Order Placed", time: new Date(createdAt).toLocaleString(), completed: true },
      { title: "Order Confirmed", time: "Pending", completed: false },
      { title: "Out for Delivery", time: "Pending", completed: false },
      { title: "Delivered", time: "Pending", completed: false },
    ]

    let progress = 25
    if (status === 'Confirmed' || status === 'Out for Delivery' || status === 'Delivered') {
        steps[1].completed = true
        progress = 50
    } 
    if (status === 'Out for Delivery' || status === 'Delivered') {
        steps[2].completed = true
        progress = 75
    } 
    if (status === 'Delivered') {
        steps[3].completed = true
        progress = 100
    }

    if (isCancelled) {
        return { progress: 0, steps: [], isCancelled: true }
    }

    return { progress, steps, isCancelled: false }
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">You have no orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const tracking = getTracking(order.status, order.createdAt)
              
              return (
              <Collapsible
                key={order._id}
                open={expandedOrder === order._id}
                onOpenChange={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              order.status === "Delivered"
                                ? "bg-primary/10"
                                : tracking.isCancelled ? "bg-destructive/10" : "bg-accent"
                            )}
                          >
                            {order.status === "Delivered" ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : tracking.isCancelled ? (
                              <XCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <Truck className="h-5 w-5 text-foreground" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">ORD{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()} - {order.orderItems?.length || 0} items
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <Badge
                              variant={
                                order.status === "Delivered"
                                  ? "default"
                                  : tracking.isCancelled ? "destructive" : "secondary"
                              }
                            >
                              {order.status || "Pending"}
                            </Badge>
                            <p className="mt-1 text-sm font-semibold">
                              Rs.{order.totalPrice}
                            </p>
                          </div>
                          {expandedOrder === order._id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-4">
                      {/* Tracking Progress */}
                      {!tracking.isCancelled && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Order Tracking</h4>
                        </div>
                        <Progress value={tracking.progress} className="h-2" />
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
                          {tracking.steps.map((step, index) => (
                            <div
                              key={index}
                              className={cn(
                                "text-center",
                                step.completed
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              <div
                                className={cn(
                                  "mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full",
                                  step.completed
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                              >
                                {step.completed ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <p className="text-xs font-medium">{step.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      )}

                      {tracking.isCancelled && (
                        <div className="rounded-lg bg-destructive/10 p-4 text-center">
                            <p className="font-semibold text-destructive">This order has been cancelled.</p>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="space-y-2">
                        <h4 className="font-semibold">Items</h4>
                        <div className="rounded-lg border">
                          {order.orderItems?.map((item: any, index: number) => (
                            <div
                              key={index}
                              className={cn(
                                "flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between",
                                index !== order.orderItems.length - 1 && "border-b"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-sm sm:text-base">{item.name}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4 pl-7 sm:justify-end sm:pl-0">
                                <span className="text-sm text-muted-foreground">
                                  x{item.quantity}
                                </span>
                                <span className="font-medium">
                                  Rs.{item.price * item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Delivery Information</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Phone: {order.shippingAddress?.phone}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Payment: {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}
