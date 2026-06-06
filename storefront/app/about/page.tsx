import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf, Flame, Heart, Award } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about Lumière — small-batch, hand-poured artisan candles crafted with natural soy wax and premium fragrance oils.',
}

const values = [
  {
    icon: Leaf,
    title: 'Natural Ingredients',
    description: 'We use 100% natural soy wax — cleaner-burning, longer-lasting, and sustainably sourced.',
  },
  {
    icon: Flame,
    title: 'Hand-Poured',
    description: 'Every candle is poured by hand in small batches, ensuring consistent quality and care in every jar.',
  },
  {
    icon: Heart,
    title: 'Made With Intention',
    description: 'Our scents are designed to evoke a feeling — not just a smell. Each fragrance is chosen to transform a moment.',
  },
  {
    icon: Award,
    title: 'Premium Fragrance Oils',
    description: 'We use only phthalate-free, skin-safe fragrance oils at maximum load for the richest possible scent throw.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center" style={{ backgroundColor: 'hsl(38 28% 96%)' }}>
        <div className="container-custom max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: 'var(--brand-primary)' }}>Our Story</p>
          <h1 className="font-heading text-h1 font-semibold text-balance">
            Born From a Love of Light and Scent
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
            Lumière began in a small kitchen with a love for ritual, fragrance, and the quiet magic of candlelight. What started as a personal practice — filling our home with intentional scents — became something we had to share.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1400&q=90"
                alt="Candle-making process — pouring warm soy wax"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-heading text-h2 font-semibold">Why We Pour Every Candle By Hand</h2>
              <p className="text-muted-foreground leading-relaxed">
                In a world of mass production, we chose to slow down. Every Lumière candle is poured in batches of under 50 — not because we have to, but because we believe the best things take time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We test every fragrance for weeks before it earns a place in our collection. We source only natural soy wax and premium, phthalate-free fragrance oils. We never cut corners — because you can smell the difference.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is simple: to help you create moments of calm, warmth, and beauty in your everyday space. One candle at a time.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest link-underline pb-0.5"
                style={{ color: 'var(--brand-primary)' }}
              >
                Shop the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-section border-t" style={{ backgroundColor: 'hsl(38 18% 94%)' }}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.22em] mb-3" style={{ color: 'var(--brand-primary)' }}>What We Stand For</p>
            <h2 className="font-heading text-h2 font-semibold">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2" style={{ backgroundColor: 'hsl(38 28% 96%)' }}>
                  <value.icon className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
