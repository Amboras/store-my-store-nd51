'use client'

import { useMemo, useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, Flame, Package, Gift, ShieldCheck, Truck, RotateCcw, Clock, Zap } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface CandleProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
  bundleVariantId?: string // variant ID for the trio gift set
  bundleProductHandle?: string
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

function formatINR(paise: number | null): string {
  if (paise === null) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

// Low stock threshold for urgency
const LOW_STOCK_THRESHOLD = 8

// Urgency: countdown timer — midnight tonight
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number }>({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const diff = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return timeLeft
}

type OfferMode = 'single' | 'bundle'

export default function CandleProductActions({ product, variantExtensions }: CandleProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) {
          defaults[optionId] = opt.value
        }
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [offerMode, setOfferMode] = useState<OfferMode>('single')
  const { addItem, isAddingItem } = useCart()
  const countdown = useCountdown()

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'inr'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock = inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity <= LOW_STOCK_THRESHOLD

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  // Bundle pricing: 2 candles of current product = 15% off
  const bundleQty = 2
  const bundlePricePer = currentPriceCents != null ? Math.round(currentPriceCents * 0.85) : null
  const bundleTotalSavings = currentPriceCents != null ? Math.round(currentPriceCents * bundleQty - (bundlePricePer ?? 0) * bundleQty) : null

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    const qty = offerMode === 'bundle' ? bundleQty : quantity
    const priceForTracking = offerMode === 'bundle' ? bundlePricePer : currentPriceCents

    addItem(
      { variantId: selectedVariant.id, quantity: qty },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success(offerMode === 'bundle' ? `${bundleQty} candles added to bag` : 'Added to bag')
          const metaValue = toMetaCurrencyValue(priceForTracking)
          trackAddToCart(product?.id || '', selectedVariant.id, qty, priceForTracking ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity: qty, item_price: metaValue }],
            num_items: qty,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  const hasMultipleVariants = variants.length > 1

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="space-y-5">
      {/* Price */}
      <ProductPrice
        amount={offerMode === 'bundle' ? bundlePricePer : currentPriceCents}
        currency={currency}
        compareAtPrice={offerMode === 'bundle' ? (currentPriceCents ?? undefined) : ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Option Selectors */}
      {hasMultipleVariants && options.map((option: ProductOptionWithValues) => {
        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
          return null
        }

        const optionId = option.id
        const selectedValue = selectedOptions[optionId]

        return (
          <div key={optionId}>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
              {option.title}
              {selectedValue && (
                <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                  — {selectedValue}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selectedValue === value
                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) => (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt) return true
                  if (vExt.allow_backorder) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`min-w-[48px] px-4 py-2.5 text-sm border transition-all ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : isAvailable
                        ? 'border-border hover:border-foreground'
                        : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ── BUNDLE OFFER ─────────────────────────────────────── */}
      <div className="border rounded-sm overflow-hidden" style={{ borderColor: 'hsl(38 15% 84%)' }}>
        {/* Single */}
        <button
          onClick={() => { setOfferMode('single'); setQuantity(1) }}
          className={`w-full flex items-start gap-4 p-4 text-left transition-colors ${offerMode === 'single' ? 'bg-background' : 'bg-muted/40 hover:bg-muted/60'}`}
        >
          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${offerMode === 'single' ? 'border-foreground' : 'border-border'}`}>
            {offerMode === 'single' && <div className="w-2 h-2 rounded-full bg-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-semibold">Single Candle</span>
              </div>
              <span className="text-sm font-semibold">{formatINR(currentPriceCents)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">One candle, perfectly packaged</p>
          </div>
        </button>

        <div className="border-t" style={{ borderColor: 'hsl(38 15% 84%)' }} />

        {/* Bundle */}
        <button
          onClick={() => setOfferMode('bundle')}
          className={`w-full flex items-start gap-4 p-4 text-left transition-colors relative ${offerMode === 'bundle' ? 'bg-background' : 'bg-muted/40 hover:bg-muted/60'}`}
        >
          {/* Recommended badge */}
          <div
            className="absolute top-3 right-3 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Best Value
          </div>
          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${offerMode === 'bundle' ? 'border-foreground' : 'border-border'}`}>
            {offerMode === 'bundle' && <div className="w-2 h-2 rounded-full bg-foreground" />}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--brand-primary)' }} strokeWidth={1.5} />
                <span className="text-sm font-semibold">Buy 2 — Save 15%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs line-through text-muted-foreground">{formatINR(currentPriceCents ? currentPriceCents * 2 : null)}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>{formatINR(bundlePricePer ? bundlePricePer * 2 : null)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              2 candles &mdash; you save {formatINR(bundleTotalSavings)}
            </p>
          </div>
        </button>
      </div>

      {/* Urgency signals */}
      <div className="space-y-2">
        {isLowStock && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-primary)' }}>
            <Flame className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-medium">Only {inventoryQuantity} left in this batch</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
          <span>
            Order within{' '}
            <span className="font-semibold tabular-nums text-foreground">
              {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </span>
            {' '}for same-day dispatch
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
          <span>12 people viewing this candle right now</span>
        </div>
      </div>

      {/* Quantity (single mode only) */}
      {offerMode === 'single' && (
        <div className="flex items-center gap-3">
          <div className="flex items-center border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-muted transition-colors"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-medium tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-muted transition-colors"
              disabled={isOutOfStock || (!allowBackorder && inventoryQuantity != null && quantity >= inventoryQuantity)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {inventoryQuantity != null ? `${inventoryQuantity} in stock` : 'In stock'}
          </p>
        </div>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAddingItem}
        className={`w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold uppercase tracking-widest transition-all ${
          isOutOfStock
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : justAdded
            ? 'text-white'
            : 'text-white hover:opacity-90'
        }`}
        style={{
          backgroundColor: isOutOfStock ? undefined : justAdded ? '#15803d' : 'var(--brand-primary)',
        }}
      >
        {isAddingItem ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to Bag
          </>
        ) : isOutOfStock ? (
          'Sold Out — Join Waitlist'
        ) : offerMode === 'bundle' ? (
          <>
            <Gift className="h-4 w-4" />
            Add Bundle to Bag
          </>
        ) : (
          'Add to Bag'
        )}
      </button>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 pt-1 border-t">
        <div className="text-center py-3">
          <ShieldCheck className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-[11px] text-muted-foreground leading-tight">Happiness<br />Guarantee</p>
        </div>
        <div className="text-center py-3">
          <Truck className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-[11px] text-muted-foreground leading-tight">Free Shipping<br />over ₹1,499</p>
        </div>
        <div className="text-center py-3">
          <RotateCcw className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-[11px] text-muted-foreground leading-tight">30-Day<br />Returns</p>
        </div>
      </div>

      {/* Secure checkout line */}
      <p className="text-center text-xs text-muted-foreground">
        Secure checkout &mdash; Visa, Mastercard, UPI &amp; more accepted
      </p>
    </div>
  )
}
