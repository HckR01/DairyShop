"use client"

import Image from "next/image"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart, Product } from "@/contexts/cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart, items } = useCart()

  const cartItem = items.find((item) => item.id === product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setQuantity(1)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className="absolute left-2 top-2">{product.category}</Badge>
        {cartItem && (
          <Badge variant="secondary" className="absolute right-2 top-2">
            {cartItem.quantity} in cart
          </Badge>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">{product.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 sm:text-sm">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-primary sm:text-lg">
            Rs.{product.price}
          </span>
          <span className="text-xs text-muted-foreground sm:text-sm">{product.unit}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 border-t p-3 sm:flex-row sm:items-center sm:p-4">
        <div className="flex items-center justify-center gap-2 rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button className="flex-1 gap-2" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
          <span className="sm:inline">Add</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
