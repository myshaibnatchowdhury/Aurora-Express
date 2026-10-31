'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { HelpCircle, Phone, Search, Ticket, ArrowRight } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />
      <div className="bg-[#071B33] text-white py-12 text-center">
        <h1 className="text-3xl font-black">সহায়তা কেন্দ্র (Help & Support)</h1>
        <p className="text-xs text-gray-300 mt-2">বুকিং, টিকেট ভেরিফিকেশন ও যাত্রা সহায়িকা</p>
      </div>
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow space-y-6 text-xs text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/my-bookings" className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-[#FF6B0A] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ticket className="w-6 h-6 text-[#FF6B0A]" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">টিকেট খুঁজুন বা প্রিন্ট করুন</h3>
                <p className="text-gray-400 text-[11px]">PNR কোড দিয়ে আপনার টিকেট ডাউনলোড করুন</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link href="/contact" className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-[#FF6B0A] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">২৪/৭ হটলাইনে কল করুন</h3>
                <p className="text-gray-400 text-[11px]">১৬২৬৩ নম্বরে যেকোনো প্রয়োজনে সহায়তা নিন</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
