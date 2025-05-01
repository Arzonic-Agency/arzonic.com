'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type Service = {
  id: string
  label: string
  price: number
  description: string
}

type Pack = {
  id: string
  label: string
  price: number
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Static starter packs
const STATIC_PACKS: Pack[] = [
  { id: 'starter', label: 'Starter Site', price: 950 },
  { id: 'webapp', label: 'Web Application', price: 1750 },
  { id: 'premium3d', label: '3D Premium', price: 2150 },
]

// VAT rates
const VAT_RATES: Record<string, { name: string; rate: number }> = {
  NONE: { name: 'No VAT', rate: 0 },
  DK: { name: 'Denmark', rate: 0.25 },
  DE: { name: 'Germany', rate: 0.19 },
  FR: { name: 'France', rate: 0.20 },
  ES: { name: 'Spain', rate: 0.21 },
  IT: { name: 'Italy', rate: 0.22 },
  NL: { name: 'Netherlands', rate: 0.21 },
  BE: { name: 'Belgium', rate: 0.21 },
  SE: { name: 'Sweden', rate: 0.25 },
  GB: { name: 'United Kingdom', rate: 0.20 },
}

export default function PriceEstimator() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null)
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>('DK')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch additional services with descriptions
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)
      try {
        const { data, error: fetchError } = await supabase
          .from<'services', Service>('services')
          .select('id, label, price, description')
          .order('label', { ascending: true })
        if (fetchError) throw fetchError
        setServices(data ?? [])
      } catch (err) {
        console.error('Error loading services:', err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

  // Auto-detect country from browser locale
  useEffect(() => {
    const locale = navigator.language
    const country = locale.split('-')[1]?.toUpperCase() ?? 'DK'
    if (VAT_RATES[country]) setSelectedCountry(country)
  }, [])

  const toggleService = (id: string) =>
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  // Calculate prices
  const pack = STATIC_PACKS.find(p => p.id === selectedPackId)
  const packPrice = pack?.price ?? 0
  const servicesTotal = selectedServiceIds
    .map(id => services.find(s => s.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0)
  const subtotal = packPrice + servicesTotal
  const vatInfo = VAT_RATES[selectedCountry] || { name: '', rate: 0 }
  const vatRate = vatInfo.rate
  const taxAmount = Math.round(subtotal * vatRate * 100) / 100
  const totalWithTax = Math.round((subtotal + taxAmount) * 100) / 100

  if (loading) return <p className="p-6">Loading services…</p>
  if (error) return <p className="p-6 text-error">Error: {error}</p>

  return (
    <div className="p-6 max-w-md mx-auto bg-base-200 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Price Estimator</h2>

      {/* Starter pack selector */}
      <div className="form-control mb-6">
        <span className="label-text font-medium block mb-2">Choose a starter pack:</span>
        <div className="flex flex-col space-y-2">
          {STATIC_PACKS.map(p => (
            <label key={p.id} className="flex items-center space-x-2">
              <input
                type="radio"
                name="pack"
                className="radio radio-primary"
                value={p.id}
                checked={selectedPackId === p.id}
                onChange={() => setSelectedPackId(p.id)}
              />
              <span className="label-text">€{p.price} – {p.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Only show extras once a pack is selected */}
      {selectedPackId && (
        <>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">Your country for VAT:</span>
            </label>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="select select-bordered w-full"
            >
              {Object.entries(VAT_RATES).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.name} ({info.rate * 100}%)
                </option>
              ))}
            </select>
          </div>
          <div className="form-control mb-6">
            <span className="label-text font-medium block mb-2">Add extra services:</span>
            <div className="flex flex-wrap gap-4">
              {services.map(s => (
                <label
                  key={s.id}
                  className="tooltip tooltip-primary flex items-center space-x-2"
                  data-tip={s.description}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedServiceIds.includes(s.id)}
                    onChange={() => toggleService(s.id)}
                  />
                  <span className="label-text">€{s.price} – {s.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="divider" />

      {/* Price breakdown */}
      <div className="text-lg mb-1">Subtotal: <span className="font-semibold">€{subtotal}</span></div>
      <div className="text-lg mb-1">VAT ({vatInfo.name} - {vatRate * 100}%): <span className="font-semibold">€{taxAmount}</span></div>
      <div className="text-2xl font-bold mb-4">Total incl. VAT: <span>€{totalWithTax}</span></div>

      <button
        className="btn btn-primary w-full"
        disabled={!selectedPackId}
        onClick={() => router.push('/contact')}
      >
        Get in Touch
      </button>

      {/* Disclaimer */}
      <p className="text-sm italic text-gray-500 mt-4">
        Disclaimer: The price shown is only an estimation and may vary. Final pricing will be confirmed upon consultation.
      </p>
    </div>
  )
}
