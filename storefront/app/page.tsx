'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Flame, Leaf, Wind, Clock, ShieldCheck, Star } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=1400&q=90'
const LIFESTYLE_IMAGE = 'https://images.unsplash.com/photo-1603905574440-4f8f8a53acd0?w=1400&q=90'
const CRAFT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=90'

const scents = [
  {
    name: 'Amber & Sandalwood',
    note: 'Warm · Woody · Grounding',
    description: 'A deep, resinous base of Indian sandalwood warmed by golden amber and a whisper of vanilla.',
    href: '/products',
  },
  {
    name: 'Jasmine & White Tea',
    note: 'Floral · Fresh · Serene',
    description: 'Delicate jasmine blooms lifted by the clean, airy softness of white tea — effortlessly calming.',
    href: '/products',
  },
  {
    name: 'Cedarwood & Bergamot',
    note: 'Citrus · Earthy · Bold',
    description: 'Crisp bergamot zest over a foundation of warm cedarwood — invigorating and beautifully balanced.',
    href: '/products',
  },
]

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
    setSubmitted(true)
  }

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'hsl(38 28% 96%)' }}>
        <div className="container-custom grid lg:grid-cols-2 gap-8 items-center py-20 lg:py-32">
          {/* Text */}
          <div className="space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--brand-primary)' }}>
              <Flame className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>Small-Batch · Hand-Poured</span>
            </div>
            <h1 className="font-heading font-semibold text-balance leading-tight" style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', lineHeight: '1.08', letterSpacing: '-0.01em' }}>
              Light That<br />Changes<br />Everything
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Artisan candles crafted from 100% natural soy wax and premium fragrance oils. Each pour is a ritual — designed to fill your space with warmth, intention, and calm.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="btn-brand-primary inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-opacity"
              >
                Shop the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-widest border hover:bg-foreground hover:text-background transition-colors"
                style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
              >
                Our Story
              </Link>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-1.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 fill-current" style={{ color: 'var(--brand-secondary)' }} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.9/5</span> — Loved by 2,400+ customers
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-sm overflow-hidden animate-fade-in glow-warm">
            <Image
              src={HERO_IMAGE}
              alt="Lumière signature candle burning — warm amber light"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Floating label */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm px-5 py-3.5 rounded-sm">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Bestseller</p>
              <p className="font-heading text-lg font-semibold">Amber &amp; Sandalwood</p>
              <p className="text-xs text-muted-foreground mt-0.5">50-hour burn time · Natural soy wax</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ──────────────────────────────────────── */}
      <section className="border-y py-5" style={{ backgroundColor: 'hsl(38 18% 94%)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Leaf className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--brand-primary)' }} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">100% Natural Soy</p>
                <p className="text-xs text-muted-foreground">No paraffin, no toxins</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--brand-primary)' }} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Premium Fragrance</p>
                <p className="text-xs text-muted-foreground">Phthalate-free oils</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--brand-primary)' }} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Up to 60 Hours</p>
                <p className="text-xs text-muted-foreground">Long, even burn</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--brand-primary)' }} strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Happiness Guarantee</p>
                <p className="text-xs text-muted-foreground">30-day returns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCENT SHOWCASE ────────────────────────────────────── */}
      <section className="py-section">
        <div className="container-custom">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.22em] mb-3" style={{ color: 'var(--brand-primary)' }}>Signature Scents</p>
            <h2 className="font-heading text-h2 font-semibold">Find Your Mood</h2>
            <p className="mt-3 text-muted-foreground">Every candle tells a story. Explore our curated range of hand-crafted fragrances — each one designed to shift the energy of your space.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {scents.map((scent) => (
              <Link
                key={scent.name}
                href={scent.href}
                className="group border border-border hover:border-foreground/30 transition-colors rounded-sm p-7 space-y-3 bg-background"
              >
                <div className="h-1 w-8 rounded-full mb-4" style={{ backgroundColor: 'var(--brand-secondary)' }} />
                <h3 className="font-heading text-xl font-semibold group-hover:text-foreground transition-colors">{scent.name}</h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{scent.note}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{scent.description}</p>
                <div className="flex items-center gap-1.5 pt-2 text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
                  <span>Shop now</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS (dynamic) ─────────────────────────────── */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* ── BRAND STORY ───────────────────────────────────────── */}
      <section className="py-section" style={{ backgroundColor: 'hsl(38 28% 96%)' }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] bg-muted rounded-sm overflow-hidden relative col-span-2 sm:col-span-1">
                <Image
                  src={LIFESTYLE_IMAGE}
                  alt="Candle ambiance — warm evening light"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="aspect-[3/4] bg-muted rounded-sm overflow-hidden relative col-span-2 sm:col-span-1 mt-8">
                <Image
                  src={CRAFT_IMAGE}
                  alt="Hand-crafting candles in small batches"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p className="text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--brand-primary)' }}>Our Philosophy</p>
              <h2 className="font-heading text-h2 font-semibold">
                Crafted in Small Batches. Made With Purpose.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every Lumière candle starts with a single question: how do we want this space to feel? We source the finest fragrance oils and pure soy wax, pour every candle by hand, and refuse to rush the process.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The result is a candle that burns cleaner, scents deeper, and lasts longer — because you deserve nothing less.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest link-underline pb-0.5"
                style={{ color: 'var(--brand-primary)' }}
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────── */}
      <section className="py-section border-t">
        <div className="container-custom max-w-xl text-center">
          <Flame className="h-8 w-8 mx-auto mb-4" style={{ color: 'var(--brand-secondary)' }} strokeWidth={1.5} />
          <h2 className="font-heading text-h2 font-semibold">Light the Way</h2>
          <p className="mt-3 text-muted-foreground">
            Get early access to new scents, exclusive offers, and rituals to elevate your everyday.
          </p>
          {submitted ? (
            <div className="mt-8 py-4 px-6 rounded-sm border text-sm font-medium" style={{ borderColor: 'var(--brand-secondary)', color: 'var(--brand-primary)' }}>
              Thank you — we will be in touch soon.
            </div>
          ) : (
            <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 border-b border-foreground/30 bg-transparent px-1 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
