import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Leaf, Shield, Users, Award, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const values = [
  {
    icon: Heart,
    title: "Quality First",
    description:
      "We source only the finest dairy products from trusted local farms, ensuring every product meets our high standards.",
  },
  {
    icon: Leaf,
    title: "Farm Fresh",
    description:
      "Our products are delivered fresh from farm to your doorstep within 24 hours of production.",
  },
  {
    icon: Shield,
    title: "100% Pure",
    description:
      "No preservatives, no additives. Just pure, natural dairy goodness as nature intended.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description:
      "We support local farmers and contribute to rural development by ensuring fair prices.",
  },
]

const stats = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "100+", label: "Local Farms" },
  { value: "500,000+", label: "Deliveries" },
  { value: "99%", label: "Satisfaction Rate" },
]

const team = [
  {
    name: "Raj Sharma",
    role: "Founder & CEO",
    image: "/team/founder.jpg",
  },
  {
    name: "Priya Patel",
    role: "Head of Operations",
    image: "/team/operations.jpg",
  },
  {
    name: "Amit Kumar",
    role: "Quality Manager",
    image: "/team/quality.jpg",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Bringing Farm Fresh Dairy to Your Family
              </h1>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                DairyFresh was born from a simple belief: everyone deserves
                access to pure, fresh, and nutritious dairy products. We
                connect local farmers directly with urban families, ensuring
                freshness and fair prices for all.
              </p>
              <Link href="/products" className="mt-8 inline-block">
                <Button size="lg" className="gap-2">
                  Explore Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative aspect-square">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <Image
                  src="/about-hero.jpg"
                  alt="Fresh dairy farm"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="mt-6 text-muted-foreground">
              Founded in 2020, DairyFresh started as a small initiative to bring
              fresh milk from local farms to our neighborhood. What began as a
              passion project by a group of friends who believed in the
              importance of pure, unadulterated dairy products, has now grown
              into a trusted brand serving over 50,000 families across the city.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our journey has been fueled by our commitment to quality,
              transparency, and customer satisfaction. We work directly with
              over 100 local dairy farmers, ensuring they receive fair
              compensation while our customers enjoy the freshest products
              possible.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y bg-card py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-10 text-primary-foreground sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 text-center sm:gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-xs text-primary-foreground/80 sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose DairyFresh?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Premium Quality</h3>
                <p className="mt-2 text-muted-foreground">
                  Every product undergoes rigorous quality checks before
                  reaching your doorstep. We maintain cold chain throughout
                  the delivery process.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Early Morning Delivery</h3>
                <p className="mt-2 text-muted-foreground">
                  Get your dairy products delivered fresh every morning before
                  7 AM. Start your day with the freshest milk and curd.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Supporting Farmers</h3>
                <p className="mt-2 text-muted-foreground">
                  By choosing DairyFresh, you directly support local farmers
                  and their families, ensuring sustainable livelihoods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t bg-card py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">Meet Our Team</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            The passionate people behind DairyFresh who work tirelessly to
            bring you the freshest dairy products.
          </p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center sm:p-6">
                  <h3 className="text-sm font-semibold sm:text-base">{member.name}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/10">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <h2 className="text-3xl font-bold">
                Join the DairyFresh Family
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Experience the difference of farm-fresh dairy products. Sign up
                today and get 20% off on your first order.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg">Create Account</Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
