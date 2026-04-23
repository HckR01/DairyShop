"use client"

import { useState } from "react"
import { Copy, Check, Tag, Calendar, Gift, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { offers } from "@/lib/products"
import { toast } from "sonner"

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Code ${code} copied to clipboard!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Special Offers & Deals
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Save big on your favorite dairy products with our exclusive offers
            and discount codes. Apply these codes at checkout to avail the
            discounts.
          </p>
        </div>

        {/* Active Offers */}
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">Active Offers</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {offers.map((offer) => (
              <Card
                key={offer.id}
                className="overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-primary/10 to-accent/20 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {offer.discount > 0
                          ? `${offer.discount}% OFF`
                          : "Special Deal"}
                      </Badge>
                      <h3 className="text-xl font-bold">{offer.title}</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{offer.description}</p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                      {offer.minOrder > 0
                        ? `Min. order Rs.${offer.minOrder}`
                        : "No minimum order"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      Valid till {offer.validTill}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-3 sm:p-4">
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="rounded-lg border-2 border-dashed border-primary/50 bg-card px-3 py-2 text-center sm:px-4">
                      <span className="font-mono text-base font-bold text-primary sm:text-lg">
                        {offer.code}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 sm:w-auto"
                      onClick={() => copyCode(offer.code)}
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Referral Section */}
        <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <CardHeader>
            <CardTitle className="text-2xl">Refer & Earn</CardTitle>
            <CardDescription>
              Share the goodness of fresh dairy with your friends and family
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  1
                </div>
                <h4 className="font-semibold">Share Your Code</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Share your unique referral code with friends
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  2
                </div>
                <h4 className="font-semibold">They Get Rs.100 Off</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your friend gets Rs.100 off on their first order
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  3
                </div>
                <h4 className="font-semibold">You Get Rs.100 Off</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  You get Rs.100 credit when they place their first order
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t pt-6">
            <div className="text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                Your referral code
              </p>
              <div className="flex items-center gap-2">
                <div className="rounded-lg border-2 border-dashed border-primary/50 bg-card px-6 py-3">
                  <span className="font-mono text-xl font-bold text-primary">
                    DAIRY100
                  </span>
                </div>
                <Button onClick={() => copyCode("DAIRY100")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Terms */}
        <div className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h3 className="mb-4 font-semibold">Terms & Conditions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              - Offers are valid only once per user unless otherwise specified
            </li>
            <li>- Offers cannot be combined with other promotions</li>
            <li>- DairyFresh reserves the right to modify or cancel offers</li>
            <li>- Minimum order value applies where mentioned</li>
            <li>- Subscription discounts are applied automatically</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
