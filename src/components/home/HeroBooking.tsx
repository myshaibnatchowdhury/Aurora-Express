'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRightLeft,
  ShieldCheck,
  Clock,
  ThumbsUp,
} from 'lucide-react';

const CITIES = [
  { value: 'Dhaka', labelBn: 'ঢাকা', labelEn: 'Dhaka' },
  { value: 'Chittagong', labelBn: 'চট্টগ্রাম', labelEn: 'Chittagong' },
  { value: 'Sylhet', labelBn: 'সিলেট', labelEn: 'Sylhet' },
  { value: "Cox's Bazar", labelBn: 'কক্সবাজার', labelEn: "Cox's Bazar" },
  { value: 'Rajshahi', labelBn: 'রাজশাহী', labelEn: 'Rajshahi' },
];

export default function HeroBooking() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [fromCity, setFromCity] = useState('Dhaka');
  const [toCity, setToCity] = useState('Chittagong');
  const [travelDate, setTravelDate] = useState('2026-10-29');
  const [passengerCount, setPassengerCount] = useState(1);

  React.useEffect(() => {
    setTravelDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(
        toCity
      )}&date=${travelDate}&passengers=${passengerCount}`
    );
  };

  return (
    <div className="relative w-full bg-[#071B33]">
      {/* Hero Banner Background & Scenic Coach Visual */}
      <div className="relative min-h-[460px] md:min-h-[520px] w-full overflow-hidden flex items-center">
        {/* Scenic Coach Highway Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-coach-banner.jpg"
            alt="Aurora Express Luxury Coach"
            fill
            className="object-cover object-right md:object-center"
            priority
          />
          {/* Subtle dark gradient overlay from left for high contrast readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071B33] via-[#071B33]/85 to-transparent/30" />
        </div>

        {/* Hero Content Left */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl text-white space-y-4">
            {/* Pill Tags / Trust Badges */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-gray-200">
              <span className="w-2 h-2 rounded-full bg-[#FF6B0A] animate-pulse" />
              <span>{t.hero.badges}</span>
            </div>

            {/* Main Brand Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              <span className="text-white drop-shadow-md">
                {language === 'bn' ? 'অরোরা ' : 'AURORA '}
              </span>
              <span className="text-[#FF6B0A] drop-shadow-lg">
                {language === 'bn' ? 'এক্সপ্রেস' : 'EXPRESS'}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl font-bold text-gray-200 drop-shadow">
              {t.hero.subTitle}
            </p>

            {/* Short Bengali / English Description */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
              {t.hero.description}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Booking Panel (Overlapping bottom edge) */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16 mb-12">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* From Input */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B0A]" />
                <span>{t.search.from}</span>
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-sm font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B0A] focus:bg-white cursor-pointer transition-all"
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {language === 'bn' ? c.labelBn : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex md:col-span-1 justify-center items-center pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#FF6B0A] bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-[#FF6B0A] flex items-center justify-center transition-all shadow-sm active:scale-95"
                title={t.search.swap}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Input */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.search.to}</span>
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-sm font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B0A] focus:bg-white cursor-pointer transition-all"
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {language === 'bn' ? c.labelBn : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="md:col-span-2 relative">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF6B0A]" />
                <span>{t.search.date}</span>
              </label>
              <input
                type="date"
                min="2026-01-01"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B0A] focus:bg-white cursor-pointer transition-all"
                required
              />
            </div>

            {/* Passengers Input */}
            <div className="md:col-span-1 relative">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span>যাত্রী</span>
              </label>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value, 10))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 text-sm font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B0A] focus:bg-white cursor-pointer"
              >
                <option value={1}>1 জন</option>
                <option value={2}>2 জন</option>
                <option value={3}>3 জন</option>
                <option value={4}>4 জন</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2 pt-2 md:pt-5">
              <button
                type="submit"
                className="w-full bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold py-3.5 px-6 rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-98"
              >
                <Search className="w-5 h-5" />
                <span>{t.search.searchBtn}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
