"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Package, MapPin, Phone, Mail, Edit2, LogOut, Calendar, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  const [orders, setOrders] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user])

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const [ordersRes, subsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/my`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (ordersRes.ok) {
          setOrders(await ordersRes.json())
        }
        if (subsRes.ok) {
          setSubscriptions(await subsRes.json())
        }
      } catch (error) {
        console.error("Failed to fetch profile data", error)
      }
    }

    if (isAuthenticated) {
      fetchProfileData()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be logged in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Create Account</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSave = async () => {
    const success = await updateProfile(formData)
    if (success) {
      setEditing(false)
      toast.success("Profile updated successfully")
    } else {
      toast.error("Failed to update profile")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    toast.success("Logged out successfully")
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">My Account</h1>
          <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 sm:grid sm:grid-cols-4">
            <TabsTrigger value="profile" className="flex-1 sm:flex-none">Profile</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 sm:flex-none">Orders</TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex-1 sm:flex-none">Subs</TabsTrigger>
            <TabsTrigger value="addresses" className="flex-1 sm:flex-none">Address</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base sm:text-lg">{user?.name}</CardTitle>
                      <CardDescription className="truncate text-xs sm:text-sm">{user?.email}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 sm:w-auto"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit2 className="h-4 w-4" />
                    {editing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span>{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{user?.phone || "Add phone number"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>{user?.address || "Add address"}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">You have no orders yet.</p>
                  ) : orders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">ORD{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.orderItems?.length || 0} items - Rs.{order.totalPrice}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            order.status === "Delivered" ? "default" : "secondary"
                          }
                        >
                          {order.status || "Pending"}
                        </Badge>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {orders.length > 0 && (
                  <div className="mt-6 text-center">
                    <Link href="/orders">
                      <Button variant="outline">View All Orders</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>My Subscriptions</CardTitle>
                <CardDescription>
                  Manage your recurring deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">You have no active subscriptions.</p>
                  ) : subscriptions.map((sub) => (
                    <div
                      key={sub._id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{sub.product?.name || "Product"}</p>
                          <p className="text-sm text-muted-foreground">
                            {sub.frequency} - Qty: {sub.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">{sub.status}</Badge>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Start: {new Date(sub.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/subscriptions">
                    <Button variant="outline">Browse Subscriptions</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>
                  Manage your delivery addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Home</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.address || "No address saved"}
                        </p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
