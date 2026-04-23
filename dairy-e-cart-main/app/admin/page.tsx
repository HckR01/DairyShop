"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, ShoppingBag, PackagePlus, FileText, CheckCircle, Package, User, CalendarDays, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Product } from "@/contexts/cart-context"

interface Order {
  _id: string
  user: { name: string; email: string }
  status: string
  totalPrice: number
  isPaid: boolean
  paymentMethod: string
  createdAt: string
  orderItems: Array<{ name: string; quantity: number; price: number }>
  shippingAddress: { street: string; city: string; pincode: string; phone: string }
}

interface DashboardStats {
  totalOrders: number
  totalSubs: number
  totalUsers: number
  totalRevenue: string
}

interface Subscription {
  _id: string
  user: { name: string; email: string }
  product: { name: string; price: number }
  quantity: number
  frequency: string
  startDate: string
  status: string
  shippingAddress: { street: string; city: string; pincode: string; phone: string }
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Milk",
    unit: "Litre",
    stock: "",
    imageUrl: "https://via.placeholder.com/150",
    isSubscriptionAvailable: false
  })

  useEffect(() => {
    // If not authenticated or not an admin, redirect
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/")
      toast.error("Not authorized to access Admin Dashboard")
    }
  }, [isAuthenticated, user, loading, router])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (res.ok) setStats(await res.json())
    } catch (err) {
      console.error(err)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (res.ok) setOrders(await res.json())
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.map((p: any) => ({ ...p, id: p._id, image: p.imageUrl })))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subscriptions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (res.ok) setSubscriptions(await res.json())
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      setLoading(true)
      Promise.all([fetchStats(), fetchOrders(), fetchProducts(), fetchSubscriptions()]).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/order/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success("Order status updated")
        fetchOrders()
      } else {
        toast.error("Failed to update status")
      }
    } catch (err) {
      toast.error("Network error")
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock)
        })
      })
      if (res.ok) {
        toast.success("Product added successfully!")
        fetchProducts()
        setNewProduct({
          name: "", description: "", price: "", category: "Milk", unit: "Litre", stock: "", imageUrl: "https://via.placeholder.com/150", isSubscriptionAvailable: false
        })
        setActiveTab("inventory")
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to add product")
      }
    } catch (err) {
      toast.error("Network error")
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (res.ok) {
        toast.success("Product deleted successfully!")
        fetchProducts()
      } else {
        toast.error("Failed to delete product")
      }
    } catch (err) {
      toast.error("Network error")
    }
  }

  if (loading) return <div className="flex h-[50vh] items-center justify-center">Loading dashboard...</div>
  if (!isAuthenticated || user?.role !== "admin") return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your dairy shop, orders, and inventory.</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Logged in as {user.name} (Admin)
        </Badge>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 overflow-x-auto pb-4 md:pb-0">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="justify-start whitespace-nowrap"
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="justify-start whitespace-nowrap"
              onClick={() => setActiveTab("orders")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button
              variant={activeTab === "subscriptions" ? "default" : "ghost"}
              className="justify-start whitespace-nowrap"
              onClick={() => setActiveTab("subscriptions")}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Subscriptions
            </Button>
            <Button
              variant={activeTab === "inventory" ? "default" : "ghost"}
              className="justify-start whitespace-nowrap"
              onClick={() => setActiveTab("inventory")}
            >
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </Button>
            <Button
              variant={activeTab === "add-item" ? "default" : "ghost"}
              className="justify-start whitespace-nowrap"
              onClick={() => setActiveTab("add-item")}
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Overview Statistics</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <span className="text-muted-foreground">₹</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRevenue}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSubs}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Manage Orders</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">No orders found.</p>
                ) : (
                  orders.map(order => (
                    <Card key={order._id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-lg">Order #{order._id.slice(-6)}</p>
                            <p className="text-sm text-muted-foreground">By: {order.user?.name || "Guest"} ({order.user?.email || "N/A"})</p>
                            <p className="text-sm text-muted-foreground">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <div className="mt-2 text-sm">
                              {order.orderItems?.map((item, i) => (
                                <span key={i} className="inline-block mr-2 bg-secondary px-2 py-1 rounded">
                                  {item.quantity}x {item.name}
                                </span>
                              ))}
                            </div>
                            <p className="mt-2 font-bold text-primary">Total: ₹{order.totalPrice}</p>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[150px]">
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(val) => handleUpdateOrderStatus(order._id, val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge variant={order.isPaid ? "default" : "destructive"} className="justify-center">
                              {order.isPaid ? "Paid" : "Unpaid"} - {order.paymentMethod}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS TAB */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Manage Subscriptions</h2>
              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <p className="text-muted-foreground">No active subscriptions found.</p>
                ) : (
                  subscriptions.map(sub => (
                    <Card key={sub._id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-lg">Sub #{sub._id.slice(-6)}</p>
                            <p className="text-sm text-muted-foreground">By: {sub.user?.name || "Guest"} ({sub.user?.email || "N/A"})</p>
                            <p className="text-sm text-muted-foreground">Started: {new Date(sub.startDate).toLocaleDateString()}</p>
                            <div className="mt-2 text-sm">
                              <span className="inline-block mr-2 bg-secondary px-2 py-1 rounded">
                                {sub.quantity}x {sub.product?.name || "Unknown Product"}
                              </span>
                              <Badge variant="outline">{sub.frequency}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Delivery: {sub.shippingAddress.street}, {sub.shippingAddress.city}</p>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[150px]">
                            <Badge variant={sub.status === "Active" ? "default" : "secondary"} className="justify-center py-1">
                              Status: {sub.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Inventory</h2>
                <Button onClick={() => setActiveTab("add-item")}>Add New Item</Button>
              </div>
              <div className="rounded-md border">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map(product => (
                      <tr key={product.id}>
                        <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
                        <td className="px-4 py-3 text-sm">₹{product.price}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={product.stock && product.stock > 10 ? "secondary" : "destructive"}>
                            {product.stock || 0} in stock
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD ITEM TAB */}
          {activeTab === "add-item" && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-2xl font-semibold">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit (e.g. 1 Liter)</Label>
                    <Input id="unit" required value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input id="stock" type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>

                <Button type="submit" className="w-full">Create Product</Button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
