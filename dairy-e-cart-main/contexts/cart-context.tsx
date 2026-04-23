"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  unit: string
  stock?: number
}

export interface CartItem extends Product {
  quantity: number
  subscription?: {
    frequency: "daily" | "weekly" | "monthly"
    startDate: string
  }
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  addSubscription: (productId: string, frequency: "daily" | "weekly" | "monthly", startDate: string) => void
  removeSubscription: (productId: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // Fetch cart from backend on login
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            headers: getAuthHeaders()
          })
          if (res.ok) {
            const data = await res.json()
            if (data.items && data.items.length > 0) {
              const validItems = data.items.filter((item: any) => item.product !== null)
              const formattedItems: CartItem[] = validItems.map((item: any) => ({
                id: item.product._id || item.product,
                name: item.name,
                price: item.price,
                image: item.image || item.product.imageUrl || "",
                category: item.product.category || "",
                description: item.product.description || "",
                unit: item.product.unit || "",
                quantity: item.quantity
              }))
              setItems(formattedItems)
            } else {
                setItems([])
            }
          }
        } catch (error) {
          console.error("Failed to fetch cart", error)
        }
      }
    }
    fetchCart()
  }, [isAuthenticated])

  const addToCart = async (product: Product, quantity: number = 1) => {
    // 1. Update local state immediately for fast UI
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })

    // 2. Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ productId: product.id, quantity })
        })
        if (!res.ok) {
          toast.error("Failed to sync cart with server")
        }
      } catch (error) {
        console.error("Failed to sync add to cart", error)
        toast.error("Network error while adding to cart")
      }
    }
  }

  const removeFromCart = async (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))

    if (isAuthenticated) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        })
      } catch (error) {
        console.error("Failed to sync remove from cart", error)
      }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )

    if (isAuthenticated) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/updateCartQuantity`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ productId, quantity })
        })
      } catch (error) {
        console.error("Failed to sync update quantity", error)
      }
    }
  }

  const addSubscription = (
    productId: string,
    frequency: "daily" | "weekly" | "monthly",
    startDate: string
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, subscription: { frequency, startDate } }
          : item
      )
    )
  }

  const removeSubscription = (productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, subscription: undefined } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    // Backend clearing is usually handled by checkout endpoint automatically
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        addSubscription,
        removeSubscription,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
