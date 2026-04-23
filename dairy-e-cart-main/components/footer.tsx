import Link from "next/link"
import { Milk, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary sm:h-10 sm:w-10">
                <Milk className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
              </div>
              <span className="text-lg font-bold sm:text-xl">DairyFresh</span>
            </Link>
            <p className="mt-3 text-xs text-muted-foreground sm:mt-4 sm:text-sm">
              Delivering farm-fresh dairy products to your doorstep since 2020.
              Quality you can trust, freshness you can taste.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">Quick Links</h3>
            <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
              <li>
                <Link href="/products" className="hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="hover:text-primary">
                  Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-primary">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">Account</h3>
            <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
              <li>
                <Link href="/profile" className="hover:text-primary">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">Contact Us</h3>
            <ul className="space-y-2 text-xs text-muted-foreground sm:space-y-3 sm:text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">support@dairyfresh.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">123 Dairy Lane, Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 DairyFresh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
