'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  Store,
  Ticket,
  DollarSign,
  TrendingUp,
  Clock,
  Printer,
  PlusCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function CounterDashboardPage() {
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();

  const activeCounter = db.counters.find((c) => c.id === (user?.counterId || 'cnt-gabtoli')) || db.counters[0];
  const activeShift = db.shifts.find((s) => s.counterId === activeCounter.id && s.status === 'OPEN') || db.shifts[0];
  const counterBookings = db.bookings.filter((b) => b.counterId === activeCounter.id || b.bookedVia === 'COUNTER');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Counter POS Top Bar */}
      <div className="bg-[#071B33] text-white py-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                POINT OF SALE (POS) ACTIVE
              </span>
            </div>
            <h1 className="text-2xl font-black">
              {activeCounter.nameBn} ({activeCounter.name})
            </h1>
            <p className="text-xs text-gray-400">
              কাউন্টার অপারেটর: <strong>{user?.fullName}</strong> • শিফট শুরু: {new Date(activeShift?.openedAt || Date.now()).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/counter/book"
              className="px-5 py-3 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন টিকিট ইস্যু (POS)</span>
            </Link>
            <Link
              href="/counter/closing"
              className="px-4 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs flex items-center gap-2 border border-navy-700 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>ক্যাশ ড্রয়ার ক্লোজিং</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Shift Cash Sales */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">আজকের ক্যাশ বিক্রি</span>
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-navy-900">
              {formatPrice(activeShift?.cashSalesTotal || 18750)}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold block">
              + লাইভ শিফট কালেকশন
            </span>
          </div>

          {/* Card 2: Expected Drawer Balance */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[#FF6B0A]">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">ড্রয়ার মোট ক্যাশ</span>
              <Store className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-navy-900">
              {formatPrice(activeShift?.expectedClosingCash || 23750)}
            </p>
            <span className="text-[11px] text-gray-500 font-semibold block">
              ওপেনিং ফ্লট: {formatPrice(activeShift?.openingCash || 5000)}
            </span>
          </div>

          {/* Card 3: Issued Tickets */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-blue-600">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">ইস্যুকৃত টিকিট</span>
              <Ticket className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-navy-900">
              {counterBookings.length + 14} টি
            </p>
            <span className="text-[11px] text-blue-600 font-semibold block">
              শতভাগ অনুমোদিত
            </span>
          </div>

          {/* Card 4: Counter Status */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-purple-600">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">কাউন্টার স্ট্যাটাস</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600">
              OPEN
            </p>
            <span className="text-[11px] text-gray-500 font-semibold block">
              টার্মিনাল কানেকশন সক্রিয়
            </span>
          </div>
        </div>

        {/* Recent Counter Activity Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-900">কাউন্টারের সাম্প্রতিক টিকিট বিক্রয় রেকর্ড</h3>
            <Link
              href="/counter/book"
              className="text-xs font-bold text-[#FF6B0A] hover:underline flex items-center gap-1"
            >
              <span>+ দ্রুত টিকিট কাটুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">PNR</th>
                  <th className="px-6 py-3">যাত্রীর নাম ও ফোন</th>
                  <th className="px-6 py-3">রুট ও ট্রিপ</th>
                  <th className="px-6 py-3">আসন</th>
                  <th className="px-6 py-3">পেমেন্ট মেথড</th>
                  <th className="px-6 py-3">মোট ভাড়া</th>
                  <th className="px-6 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {db.bookings.slice(0, 6).map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-navy-900">{b.pnr}</td>
                    <td className="px-6 py-3">
                      <strong className="text-navy-900 block">{b.passengerName}</strong>
                      <span className="text-gray-400 font-mono text-[11px]">{b.passengerPhone}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span>{b.trip?.route?.origin} ➔ {b.trip?.route?.destination}</span>
                      <span className="text-gray-400 block text-[11px]">{b.trip?.departureDate} ({b.trip?.departureTime})</span>
                    </td>
                    <td className="px-6 py-3 font-mono font-bold text-[#FF6B0A]">
                      {b.seatNumbers.join(', ')}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800">
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-bold text-navy-900">
                      {formatPrice(b.totalAmount)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/ticket/${b.id}`}
                        className="px-3 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow-sm"
                      >
                        <Printer className="w-3 h-3" />
                        <span>প্রিন্ট</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
