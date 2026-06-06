'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductAccordionProps {
  description?: string | null
  details?: Record<string, string>
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium tracking-wide">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({ description, details }: ProductAccordionProps) {
  return (
    <div className="border-t">
      {description && (
        <AccordionItem title="Description" defaultOpen>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionItem>
      )}

      <AccordionItem title="Candle Care">
        <ul className="space-y-2">
          <li>Trim the wick to 5mm before every burn for a clean, even flame</li>
          <li>Allow the wax to melt fully to the edges on the first burn (2–3 hours)</li>
          <li>Never burn for more than 4 hours at a time</li>
          <li>Keep away from drafts, children, and pets</li>
          <li>Discontinue use when 10mm of wax remains</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Ingredients">
        <ul className="space-y-2">
          <li>100% natural soy wax (non-GMO)</li>
          <li>Premium phthalate-free fragrance oil</li>
          <li>Natural cotton-core wick (lead-free)</li>
          <li>Reusable glass vessel</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Shipping & Returns">
        <ul className="space-y-2">
          <li>Free standard shipping on orders over ₹1,499</li>
          <li>Express shipping available at checkout</li>
          <li>Free returns within 30 days of delivery</li>
          <li>Candles must be unlit and in original packaging for returns</li>
        </ul>
      </AccordionItem>
    </div>
  )
}
