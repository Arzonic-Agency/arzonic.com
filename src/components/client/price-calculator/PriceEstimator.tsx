'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Pack = { id: string; label: string; price: number };
type Service = { id: string; label: string; price: number; description: string };

// VAT rates with names and percentages
const VAT_RATES: Record<string, { name: string; rate: number }> = {
  NONE: { name: 'No VAT', rate: 0 },
  DK: { name: 'Denmark', rate: 0.25 },
  DE: { name: 'Germany', rate: 0.19 },
  FR: { name: 'France', rate: 0.2 },
  ES: { name: 'Spain', rate: 0.21 },
  IT: { name: 'Italy', rate: 0.22 },
  NL: { name: 'Netherlands', rate: 0.21 },
  BE: { name: 'Belgium', rate: 0.21 },
  SE: { name: 'Sweden', rate: 0.25 },
  GB: { name: 'United Kingdom', rate: 0.2 },
};

// SWR fetcher for packs (sorted by price ascending)
const fetchPacks = async (): Promise<Pack[]> => {
  const { data, error } = await supabase
    .from<'packs', Pack>('packs')
    .select('id, label, price')
    .order('price', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

// SWR fetcher for services
const fetchServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from<'services', Service>('services')
    .select('id, label, price, description')
    .order('label', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

const PriceEstimator: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // Fetch packs and services
  const {
    data: packs = [],
    error: packError,
    isLoading: packsLoading,
  } = useSWR('packs', fetchPacks, { revalidateOnFocus: false });
  const {
    data: services = [],
    error: serviceError,
    isLoading: servicesLoading,
  } = useSWR('services', fetchServices, { revalidateOnFocus: false });

  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('DK');

  // Auto-detect country for VAT
  useEffect(() => {
    const locale = navigator.language;
    const country = locale.split('-')[1]?.toUpperCase() ?? 'DK';
    if (VAT_RATES[country]) setSelectedCountry(country);
  }, []);

  const toggleService = (id: string) =>
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Loading / error states
  if (packsLoading || servicesLoading) {
    return <p className="p-6">{t('PriceEstimator.loading')}</p>;
  }
  if (packError || serviceError) {
    return (
      <p className="p-6 text-error">
        {t('PriceEstimator.error', { message: (packError || serviceError)?.message })}
      </p>
    );
  }

  // Price calculations
  const chosenPack = packs.find((p) => p.id === selectedPackId);
  const packPrice = chosenPack?.price ?? 0;
  const extrasTotal = selectedServiceIds
    .map((id) => services.find((s) => s.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0);
  const subtotal = packPrice + extrasTotal;
  const vatInfo = VAT_RATES[selectedCountry] || { name: t('PriceEstimator.noVAT'), rate: 0 };
  const vatAmount = Math.round(subtotal * vatInfo.rate * 100) / 100;
  const total = Math.round((subtotal + vatAmount) * 100) / 100;

  return (
    <div className="p-6 max-w-md mx-auto bg-base-200 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">{t('PriceEstimator.title')}</h2>

      {/* Packs */}
      <div className="form-control mb-6">
        <span className="label-text font-medium block mb-2">
          {t('PriceEstimator.choosePack')}
        </span>
        <div className="flex flex-col space-y-2">
          {packs.map((p) => (
            <label key={p.id} className="flex items-center space-x-2">
              <input
                type="radio"
                name="pack"
                className="radio radio-primary"
                value={p.id}
                checked={selectedPackId === p.id}
                onChange={() => setSelectedPackId(p.id)}
              />
              <span className="label-text">
                {t('PriceEstimator.packLabel', { price: p.price, label: p.label })}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Services */}
      {selectedPackId && (
        <>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">
                {t('PriceEstimator.countryForVAT')}
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {Object.entries(VAT_RATES).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.name} ({info.rate * 100}%)
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-6">
            <span className="label-text font-medium block mb-2">
              {t('PriceEstimator.addServices')}
            </span>
            <div className="flex flex-wrap gap-4">
              {services.map((s) => (
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
                  <span className="label-text">
                    {t('PriceEstimator.serviceLabel', { price: s.price, label: s.label })}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="divider" />

      {/* Breakdown */}
      <div className="text-lg mb-1">
        {t('PriceEstimator.subtotal')}: <span className="font-semibold">€{subtotal}</span>
      </div>
      <div className="text-lg mb-1">
        {t('PriceEstimator.vat', { name: vatInfo.name, rate: vatInfo.rate * 100 })}: <span className="font-semibold">€{vatAmount}</span>
      </div>
      <div className="text-2xl font-bold mb-4">
        {t('PriceEstimator.totalInclVAT')}: <span>€{total}</span>
      </div>

      {/* Contact button */}
      <button
        className="btn btn-primary w-full"
        disabled={!selectedPackId}
        onClick={() => router.push('/contact')}
      >
        {t('PriceEstimator.getInTouch')}
      </button>

      {/* Disclaimer */}
      <p className="text-sm italic text-gray-500 mt-4">
        {t('PriceEstimator.disclaimer')}
      </p>
    </div>
  );
};

export default PriceEstimator;
