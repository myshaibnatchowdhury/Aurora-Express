'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';
import { Bus, MapPin, Building2, Smile, ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  const { language, t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-[#071B33] text-white shadow-xl">
        {/* Background Image / Subtle Highway Glow */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/promo-bg.jpg"
            alt="Highway Travel"
            fill
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071B33] via-[#071B33]/90 to-transparent" />
        </div>

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left CTA */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
              <Bus className="w-4 h-4" />
              <span>{t.promo.title}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-snug">
              {t.promo.subtitle}
            </h3>
            <div>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-95"
              >
                <span>{t.promo.button}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto lg:mx-0 text-[#FF6B0A]">
                <Bus className="w-4 h-4" />
              </div>
              <p className="text-lg font-black text-white">{t.promo.statBuses.split(' ')[0]}</p>
              <p className="text-[11px] text-gray-400">{language === 'bn' ? 'বাস' : 'Buses'}</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto lg:mx-0 text-emerald-400">
                <Building2 className="w-4 h-4" />
              </div>
              <p className="text-lg font-black text-white">{t.promo.statRoutes.split(' ')[0]}</p>
              <p className="text-[11px] text-gray-400">{language === 'bn' ? 'রুট' : 'Routes'}</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto lg:mx-0 text-amber-400">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-lg font-black text-white">{t.promo.statCounters.split(' ')[0]}</p>
              <p className="text-[11px] text-gray-400">{language === 'bn' ? 'কাউন্টার' : 'Counters'}</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto lg:mx-0 text-blue-400">
                <Smile className="w-4 h-4" />
              </div>
              <p className="text-lg font-black text-white">{t.promo.statPassengers.split(' ')[0]}</p>
              <p className="text-[11px] text-gray-400">{language === 'bn' ? 'সন্তুষ্ট যাত্রী' : 'Riders'}</p>
            </div>
          </div>

          {/* Right Script Slogan */}
          <div className="lg:col-span-2 text-center lg:text-right">
            <span className="inline-block text-2xl sm:text-3xl font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-white transform -rotate-3">
              Travel With
              <br />
              Confidence
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
