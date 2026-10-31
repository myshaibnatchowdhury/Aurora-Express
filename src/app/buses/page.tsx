'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bus,
  CheckCircle2,
  Armchair,
  Wifi,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function BusFleetPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-[#071B33] text-white py-12 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mb-1">
            AURORA EXPRESS LUXURY FLEET
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            {language === 'bn' ? 'আমাদের অত্যাধুনিক বাস বহর' : 'Our Modern Fleet & Coaches'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2">
            সর্বোচ্চ নিরাপত্তা, স্বাচ্ছন্দ্য ও সময়ানুবর্তিতা নিশ্চিত করতে ইউরোপীয় মানের স্ক্যানিয়া ও হুন্দাই লাক্সারি কোচ
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {db.buses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-navy-900 text-white font-mono text-xs font-bold">
                    {bus.coachNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[#FF6B0A]">
                    {bus.busType.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-navy-900">{bus.model}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{bus.registrationNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Armchair className="w-4 h-4 text-[#FF6B0A]" />
                    <span>সিটিং লেআউট: <strong>{bus.seatingLayout}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bus className="w-4 h-4 text-[#FF6B0A]" />
                    <span>মোট আসন: <strong>{bus.totalSeats} টি</strong></span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-2">
                    অন-বোর্ড সুযোগ-সুবিধাসমূহ
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {bus.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  নিয়মিত রুটে পরিচালিত
                </span>
                <Link
                  href="/search"
                  className="px-4 py-2 bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
                >
                  <span>টিকিট কাটুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
