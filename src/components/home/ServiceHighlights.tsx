'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Shield, Armchair, Clock, Ticket, Headphones } from 'lucide-react';

export default function ServiceHighlights() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Shield,
      title: t.features.safeTravel,
      desc: t.features.safeTravelDesc,
    },
    {
      icon: Armchair,
      title: t.features.comfortableSeats,
      desc: t.features.comfortableSeatsDesc,
    },
    {
      icon: Clock,
      title: 'সময়ানুবর্তিতা',
      desc: t.features.punctualityDesc,
    },
    {
      icon: Ticket,
      title: t.features.onlineTicket,
      desc: t.features.onlineTicketDesc,
    },
    {
      icon: Headphones,
      title: t.features.support,
      desc: t.features.supportDesc,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
        {services.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 px-3 py-3 lg:px-4 lg:py-1 hover:bg-orange-50/50 rounded-xl transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#FF6B0A]">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
