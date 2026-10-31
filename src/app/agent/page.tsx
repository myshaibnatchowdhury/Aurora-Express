'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Percent,
  PlusCircle,
  FileText,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export default function AgentPortalPage() {
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();

  const activeAgent = db.agents[0];
  const agentBookings = db.bookings.filter((b) => b.bookedVia === 'AGENT' || b.agentId === activeAgent.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#071B33] text-white py-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                AUTHORIZED AGENT PORTAL
              </span>
            </div>
            <h1 className="text-2xl font-black">
              {activeAgent.agencyName}
            </h1>
            <p className="text-xs text-gray-400">
              এজেন্ট পার্টনার: <strong>{activeAgent.agentName}</strong> ({activeAgent.phone})
            </p>
          </div>

          <Link
            href="/search"
            className="px-5 py-2.5 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন টিকিট বুক করুন (কমিশন সহ)</span>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">বর্তমান ব্যালেন্স / ডিপোজিট</span>
            <p className="text-2xl font-black text-navy-900">{formatPrice(activeAgent.currentBalance)}</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">ক্রেডিট লিমিট: {formatPrice(activeAgent.creditLimit)}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">কমিশন রেট</span>
            <p className="text-2xl font-black text-[#FF6B0A]">{activeAgent.commissionRatePercent}%</p>
            <span className="text-[11px] text-gray-500 font-semibold block">প্রতি টিকেটে স্বয়ংক্রিয় হিসাব</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">মোট টিকিট বিক্রি</span>
            <p className="text-2xl font-black text-navy-900">{agentBookings.length + 8} টি</p>
            <span className="text-[11px] text-blue-600 font-semibold block">অনলাইন পার্টনার সেলস</span>
          </div>
        </div>

        {/* Financial Ledger & Commission Entries */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-900">এজেন্ট কমিশন ও লেনদেন লেজার (Immutable Ledger)</h3>
            <span className="text-xs text-gray-500">স্টেটমেন্ট এক্সপোর্ট</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">তারিখ</th>
                  <th className="px-6 py-3">লেনদেন বিবরণ</th>
                  <th className="px-6 py-3">টাইপ</th>
                  <th className="px-6 py-3">পরিমাণ</th>
                  <th className="px-6 py-3">রেফারেন্স ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-3">আজকে</td>
                  <td className="px-6 py-3 font-semibold text-navy-900">টিকিট বুকিং কমিশন (৬.৫%)</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CREDIT
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-emerald-600">+ ৳ ১০৮</td>
                  <td className="px-6 py-3 font-mono">AE-784912</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-3">গতকাল</td>
                  <td className="px-6 py-3 font-semibold text-navy-900">ব্যাংক ডিপোজিট সেটেলমেন্ট</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      SETTLEMENT
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-blue-600">+ ৳ ৫০,০০০</td>
                  <td className="px-6 py-3 font-mono">DEP-2026-9901</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
