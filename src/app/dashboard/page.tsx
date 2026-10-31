'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  LayoutDashboard,
  Bus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  PlusCircle,
  FileText,
  RotateCcw,
  Sliders,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRIPS' | 'BUSES' | 'ROUTES' | 'BOOKINGS' | 'REFUNDS' | 'REPORTS'>('OVERVIEW');

  // Tenant stats
  const totalBookings = db.bookings.length;
  const totalRevenue = db.bookings.reduce((sum, b) => (b.bookingStatus === 'CONFIRMED' ? sum + b.totalAmount : sum), 0);
  const activeBusesCount = db.buses.filter((b) => b.status === 'ACTIVE').length;
  const activeRoutesCount = db.routes.filter((r) => r.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Company Dashboard Header */}
      <div className="bg-[#071B33] text-white py-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-[#FF6B0A] text-white text-[10px] font-bold uppercase tracking-wider">
                TENANT CONSOLE
              </span>
              <span className="text-xs text-gray-400">
                {db.tenants[0]?.nameBn} ({db.tenants[0]?.name})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              কোম্পানি সেন্ট্রাল ম্যানেজমেন্ট ড্যাশবোর্ড
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              স্বাগতম, <strong>{user?.fullName}</strong> ({user?.role.replace(/_/g, ' ')})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/counter"
              className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-xs font-bold text-white border border-navy-700 transition-colors"
            >
              কাউন্টার POS মোড
            </Link>
            <Link
              href="/boarding"
              className="px-4 py-2.5 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-xs font-bold text-white transition-colors shadow-md"
            >
              বোর্ডিং স্ক্যানার
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex overflow-x-auto space-x-2 text-xs font-bold scrollbar-none border-b border-navy-800 pb-px">
            {[
              { id: 'OVERVIEW', label: 'ওভারভিউ (Overview)', icon: LayoutDashboard },
              { id: 'TRIPS', label: 'ট্রিপ সময়সূচি (Trips)', icon: Calendar },
              { id: 'BUSES', label: 'বাস বহর (Buses)', icon: Bus },
              { id: 'ROUTES', label: 'রুট ও স্টপ (Routes)', icon: MapPin },
              { id: 'BOOKINGS', label: 'বুকিং তালিকা (Bookings)', icon: FileText },
              { id: 'REFUNDS', label: 'রিফান্ড আবেদন (Refunds)', icon: RotateCcw },
              { id: 'REPORTS', label: 'হিসাব ও রিপোর্ট (Reports)', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F5F7FA] text-navy-900 border-t-2 border-[#FF6B0A]'
                      : 'text-gray-400 hover:text-white hover:bg-navy-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8 animate-in fade-in">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  মোট রাজস্ব কালেকশন
                </span>
                <p className="text-2xl font-black text-navy-900">
                  {formatPrice(totalRevenue + 85400)}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold block">
                  +১২.৫% চলতি মাস
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  সক্রিয় বাস ও কোচ
                </span>
                <p className="text-2xl font-black text-navy-900">
                  {activeBusesCount} টি বাস
                </p>
                <span className="text-[11px] text-blue-600 font-semibold block">
                  ১০০% অপারেশনাল
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  সক্রিয় আন্তঃনগর রুট
                </span>
                <p className="text-2xl font-black text-navy-900">
                  {activeRoutesCount} টি রুট
                </p>
                <span className="text-[11px] text-purple-600 font-semibold block">
                  ঢাকা-চট্টগ্রাম, সিলেট, কক্সবাজার
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  গড় আসন পূর্ণতার হার
                </span>
                <p className="text-2xl font-black text-[#FF6B0A]">
                  ৮৪.২%
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold block">
                  অনলাইন ও কাউন্টার বিক্রি
                </span>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-navy-900">সাম্প্রতিক কনফার্মড বুকিং</h3>
                  <button
                    onClick={() => setActiveTab('BOOKINGS')}
                    className="text-xs font-bold text-[#FF6B0A] hover:underline"
                  >
                    সকল দেখুন
                  </button>
                </div>
                <div className="space-y-3">
                  {db.bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-navy-900">{b.pnr}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {b.bookedVia}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium mt-0.5">
                          {b.passengerName} • আসন: <strong className="font-mono text-[#FF6B0A]">{b.seatNumbers.join(', ')}</strong>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-navy-900 block">{formatPrice(b.totalAmount)}</span>
                        <span className="text-[10px] text-gray-400">{b.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fleet Status */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-navy-900">কোম্পানি বাস বহর স্ট্যাটাস</h3>
                  <button
                    onClick={() => setActiveTab('BUSES')}
                    className="text-xs font-bold text-[#FF6B0A] hover:underline"
                  >
                    বহর পরিচালনা
                  </button>
                </div>
                <div className="space-y-3">
                  {db.buses.map((bus) => (
                    <div
                      key={bus.id}
                      className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white bg-navy-900 px-2 py-0.5 rounded">
                            {bus.coachNumber}
                          </span>
                          <span className="font-bold text-navy-900">{bus.model}</span>
                        </div>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          {bus.registrationNumber} • {bus.totalSeats} আসন ({bus.seatingLayout})
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {bus.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRIPS MANAGEMENT */}
        {activeTab === 'TRIPS' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-navy-900">ট্রিপ শিডিউল ও টিকিট তালিকা</h2>
                <p className="text-xs text-gray-500">বাস অ্যাসাইনমেন্ট, ডিপার্চার সময় ও ভাড়া কনফিগারেশন</p>
              </div>
              <button
                onClick={() => alert('নতুন ট্রিপ তৈরি ফর্ম উন্মুক্ত হচ্ছে...')}
                className="px-4 py-2 bg-[#FF6B0A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন ট্রিপ শিডিউল করুন</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">ট্রিপ নম্বর</th>
                    <th className="px-4 py-3">বাস ও কোচ</th>
                    <th className="px-4 py-3">রুট</th>
                    <th className="px-4 py-3">তারিখ ও সময়</th>
                    <th className="px-4 py-3">ভাড়া</th>
                    <th className="px-4 py-3">স্ট্যাটাস</th>
                    <th className="px-4 py-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {db.trips.slice(0, 10).map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-navy-900">{t.tripNumber}</td>
                      <td className="px-4 py-3">
                        <strong className="block text-navy-900">{t.bus?.coachNumber}</strong>
                        <span className="text-gray-400 text-[11px]">{t.bus?.model}</span>
                      </td>
                      <td className="px-4 py-3">
                        {t.route?.origin} ➔ {t.route?.destination}
                      </td>
                      <td className="px-4 py-3">
                        <span className="block font-bold">{t.departureDate}</span>
                        <span className="text-gray-500 text-[11px]">{t.departureTime} - {t.arrivalTime}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#FF6B0A]">{formatPrice(t.baseFare)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/trips/${t.id}`}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-navy-900 rounded-lg text-[11px] font-bold"
                        >
                          সিট ম্যাপ
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BUS FLEET */}
        {activeTab === 'BUSES' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-navy-900">বাস বহর পরিচালনা (Fleet)</h2>
                <p className="text-xs text-gray-500">বাসের রেজিস্ট্রেশন, সিটিং লেআউট ও সার্ভিসিং স্ট্যাটাস</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {db.buses.map((bus) => (
                <div key={bus.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-navy-900 text-white font-mono text-xs font-bold">
                      {bus.coachNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {bus.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-navy-900">{bus.model}</h3>
                    <p className="text-xs text-gray-500 font-medium">{bus.registrationNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">সিট লেআউট</span>
                      <span className="font-semibold">{bus.seatingLayout} ({bus.totalSeats} আসন)</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">ক্যাটেগরি</span>
                      <span className="font-semibold">{bus.busType.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">সুবিধাসমূহ</span>
                    <div className="flex flex-wrap gap-1.5">
                      {bus.amenities.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-700">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ROUTES */}
        {activeTab === 'ROUTES' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
            <h2 className="text-base font-bold text-navy-900">রুট ও স্টপেজ ব্যবস্থাপনা</h2>
            <div className="space-y-4">
              {db.routes.map((route) => (
                <div key={route.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-navy-900">
                      <span>{route.origin}</span>
                      <span className="text-[#FF6B0A]">➔</span>
                      <span>{route.destination}</span>
                    </div>
                    <span className="font-bold text-[#FF6B0A] text-xs">ভাড়া: {formatPrice(route.startingFare)} থেকে</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    দূরত্ব: {route.distanceKm} কিমি • সময়: {route.estimatedDuration}
                  </p>
                  <div className="text-xs text-gray-600">
                    <strong>স্টপসমূহ:</strong> {route.stops.map((s) => s.stopName).join(' ➔ ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BOOKINGS */}
        {activeTab === 'BOOKINGS' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
            <h2 className="text-base font-bold text-navy-900">সকল বুকিং তালিকা</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">PNR</th>
                    <th className="px-4 py-3">যাত্রীর নাম ও ফোন</th>
                    <th className="px-4 py-3">ট্রিপ ও রুট</th>
                    <th className="px-4 py-3">আসন</th>
                    <th className="px-4 py-3">চ্যানেল</th>
                    <th className="px-4 py-3">টাকা</th>
                    <th className="px-4 py-3 text-right">টিকিট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {db.bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-navy-900">{b.pnr}</td>
                      <td className="px-4 py-3">
                        <strong className="block text-navy-900">{b.passengerName}</strong>
                        <span className="text-gray-400 font-mono text-[11px]">{b.passengerPhone}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span>{b.trip?.route?.origin} ➔ {b.trip?.route?.destination}</span>
                        <span className="text-gray-400 block text-[11px]">{b.trip?.departureDate}</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#FF6B0A]">
                        {b.seatNumbers.join(', ')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800">
                          {b.bookedVia}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">{formatPrice(b.totalAmount)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/ticket/${b.id}`}
                          className="px-2.5 py-1 bg-navy-900 text-white rounded text-[10px] font-bold"
                        >
                          দেখুন
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REFUNDS */}
        {activeTab === 'REFUNDS' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
            <h2 className="text-base font-bold text-navy-900">রিফান্ড আবেদন ও সমন্বয়</h2>
            {db.refunds.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">কোনো বিচারাধীন রিফান্ড আবেদন নেই।</p>
            ) : (
              <div className="space-y-3">
                {db.refunds.map((ref) => (
                  <div key={ref.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-navy-900">PNR: {ref.pnr}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {ref.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        যাত্রী: <strong>{ref.requestedBy}</strong> ({ref.passengerPhone}) • কারণ: {ref.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 block text-sm">
                        রিফান্ড: {formatPrice(ref.refundableAmount)}
                      </span>
                      <span className="text-[10px] text-red-500">
                        ফি কর্তন: {formatPrice(ref.cancellationFee)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: REPORTS */}
        {activeTab === 'REPORTS' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-navy-900">অ্যাকাউন্টিং ও অপারেশনাল রিপোর্ট</h2>
              <button
                onClick={() => alert('CSV এক্সপোর্ট প্রস্তুত হচ্ছে...')}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
              >
                CSV এক্সপোর্ট
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <span className="text-xs text-gray-500 block uppercase font-bold">কাউন্টার ক্যাশ কালেকশন</span>
                <span className="text-xl font-black text-navy-900 mt-1 block">৳ ৪২,২৫০</span>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <span className="text-xs text-gray-500 block uppercase font-bold">অনলাইন পেমেন্ট গেটওয়ে</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">৳ ১,৪২,০০০</span>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <span className="text-xs text-gray-500 block uppercase font-bold">মোট অনুমোদিত রিফান্ড</span>
                <span className="text-xl font-black text-red-600 mt-1 block">৳ ১,৬৬০</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
