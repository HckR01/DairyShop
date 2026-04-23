"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const mockOrders = [
  {
    id: "ORD001",
    date: "2026-04-20",
    status: "In Transit",
    total: 450,
    items: [
      { name: "Farm Fresh Milk", quantity: 2, price: 60 },
      { name: "Greek Yogurt", quantity: 3, price: 90 },
      { name: "Pure Ghee", quantity: 1, price: 550 },
    ],
    tracking: {
      progress: 65,
      currentStep: 2,
      steps: [
        { title: "Order Placed", time: "Apr 20, 9:00 AM", completed: true },
        { title: "Order Confirmed", time: "Apr 20, 9:05 AM", completed: true },
        { title: "Out for Delivery", time: "Apr 21, 6:30 AM", completed: true },
        { title: "Delivered", time: "Expected by 8:00 AM", completed: false },
      ],
    },
    deliveryAddress: "123 Dairy Lane, Mumbai, Maharashtra",
    estimatedDelivery: "Apr 21, 2026 by 8:00 AM",
  },
  {
    id: "ORD002",
    date: "2026-04-18",
    status: "Delivered",
    total: 280,
    items: [
      { name: "Cottage Cheese", quantity: 2, price: 180 },
      { name: "Natural Curd", quantity: 2, price: 45 },
    ],
    tracking: {
      progress: 100,
      currentStep: 3,
      steps: [
        { title: "Order Placed", time: "Apr 18, 10:00 AM", completed: true },
        { title: "Order Confirmed", time: "Apr 18, 10:05 AM", completed: true },
        { title: "Out for Delivery", time: "Apr 19, 6:30 AM", completed: true },
        { title: "Delivered", time: "Apr 19, 7:45 AM", completed: true },
      ],
    },
    deliveryAddress: "123 Dairy Lane, Mumbai, Maharashtra",
    estimatedDelivery: "Delivered on Apr 19, 2026",
  },
  {
    id: "ORD003",
    date: "2026-04-15",
    status: "Delivered",
    total: 620,
    items: [
      { name: "Buffalo Milk", quantity: 5, price: 75 },
      { name: "Salted Butter", quantity: 2, price: 150 },
      { name: "Fresh Cream", quantity: 1, price: 120 },
    ],
    tracking: {
      progress: 100,
      currentStep: 3,
      steps: [
        { title: "Order Placed", time: "Apr 15, 8:00 AM", completed: true },
        { title: "Order Confirmed", time: "Apr 15, 8:05 AM", completed: true },
        { title: "Out for Delivery", time: "Apr 16, 6:00 AM", completed: true },
        { title: "Delivered", time: "Apr 16, 7:30 AM", completed: true },
      ],
    },
    deliveryAddress: "123 Dairy Lane, Mumbai, Maharashtra",
    estimatedDelivery: "Delivered on Apr 16, 2026",
  },
]

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const [expandedOrder, setExpandedOrder] = useState<string | null>("ORD001")

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

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Collapsible
              key={order.id}
              open={expandedOrder === order.id}
              onOpenChange={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
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
                              : "bg-accent"
                          )}
                        >
                          {order.status === "Delivered" ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Truck className="h-5 w-5 text-foreground" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.date} - {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="mt-1 text-sm font-semibold">
                            Rs.{order.total}
                          </p>
                        </div>
                        {expandedOrder === order.id ? (
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Order Tracking</h4>
                        <span className="text-sm text-muted-foreground">
                          {order.estimatedDelivery}
                        </span>
                      </div>
                      <Progress value={order.tracking.progress} className="h-2" />
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
                        {order.tracking.steps.map((step, index) => (
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
                            <p className="text-xs text-muted-foreground">
                              {step.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Items</h4>
                      <div className="rounded-lg border">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between",
                              index !== order.items.length - 1 && "border-b"
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
                        <p className="text-sm font-medium">Delivery Address</p>
                        <p className="text-sm text-muted-foreground">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {order.status === "Delivered" ? (
                        <>
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                          <Button variant="outline" size="sm">
                            Leave Review
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm">
                            Contact Support
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  )
}
