'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { INITIAL_ROUTES } from '@/lib/mock-data';
import { Clock, ChevronRight } from 'lucide-react';

export default function PopularRoutes() {
  const router = useRouter();
  const { language, t, formatPrice } = useLanguage();

  const handleRouteClick = (origin: string, destination: string) => {
    const today = new Date().toISOString().split('T')[0];
    router.push(
      `/search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(
        destination
      )}&date=${today}`
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF6B0A] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            {t.popularRoutes.title}
          </h2>
        </div>
        <Link
          href="/search"
          className="text-xs sm:text-sm font-bold text-navy-800 hover:text-[#FF6B0A] flex items-center gap-1 transition-colors"
        >
          <span>{t.popularRoutes.viewAll}</span>
          <ChevronRight className="w-4 h-4 text-[#FF6B0A]" />
        </Link>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {INITIAL_ROUTES.map((route) => {
          return (
            <div
              key={route.id}
              onClick={() => handleRouteClick(route.origin, route.destination)}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Route Landmark Image */}
              <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                <Image
                  src={route.imageUrl}
                  alt={`${route.origin} to ${route.destination}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <h3 className="text-sm font-bold truncate">
                    {language === 'bn' ? `${route.originBn} → ${route.destinationBn}` : `${route.origin} → ${route.destination}`}
                  </h3>
                </div>
              </div>

              {/* Details & Price */}
              <div className="p-3.5 flex flex-col flex-grow justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{language === 'bn' ? route.estimatedDurationBn : route.estimatedDuration}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                      {t.popularRoutes.startingFrom}
                    </span>
                    <span className="text-sm font-black text-[#FF6B0A]">
                      {formatPrice(route.startingFare)}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-orange-50 text-[#FF6B0A] group-hover:bg-[#FF6B0A] group-hover:text-white flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
