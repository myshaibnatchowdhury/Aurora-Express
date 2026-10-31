'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { INITIAL_PLANS } from '@/lib/mock-data';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Settings,
  Sliders,
} from 'lucide-react';

export default function SuperAdminPlatformPage() {
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();
  const [tenantsList, setTenantsList] = useState(db.tenants);

  const toggleTenantStatus = (id: string) => {
    setTenantsList((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...t, status: next };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Platform Header */}
      <div className="bg-[#040F1D] text-white py-10 border-b border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                SAAS SUPER ADMIN CONSOLE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              মাল্টি-টেন্যান্ট বাস টিকিটিং ক্লাউড প্ল্যাটফর্ম
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              সুপার অ্যাডমিনিস্ট্রেটর: <strong>{user?.fullName}</strong> ({user?.email})
            </p>
          </div>

          <div className="px-4 py-2 bg-navy-900 border border-navy-800 rounded-xl text-xs text-gray-300">
            প্ল্যাটফর্ম ভার্সন: <strong>v2.4 LTS</strong> (Multi-Tenant RLS Enabled)
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">নিবন্ধিত বাস কোম্পানি</span>
            <p className="text-2xl font-black text-navy-900">{tenantsList.length} টি কোম্পানি</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">১০০% অ্যাক্টিভ টেন্যান্ট</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">SaaS সাবস্ক্রিপশন রাজস্ব</span>
            <p className="text-2xl font-black text-navy-900">৳ ৪,৮৫,০০০</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">চলতি মাস রিনিউয়াল</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">প্ল্যাটফর্ম ইউজার্স</span>
            <p className="text-2xl font-black text-navy-900">১২,৪৫০ জন</p>
            <span className="text-[11px] text-blue-600 font-semibold block">যাত্রী ও স্টাফ অ্যাকাউন্ট</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">সিস্টেম হেলথ ও আপটাইম</span>
            <p className="text-2xl font-black text-emerald-600">৯৯.৯৮%</p>
            <span className="text-[11px] text-gray-400 font-semibold block">PostgreSQL RLS Active</span>
          </div>
        </div>

        {/* Tenant Companies Management */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-900">কোম্পানি ও টেন্যান্ট পরিচালনা (Tenants)</h3>
              <p className="text-xs text-gray-500">অনবোর্ডিং অনুমোদন, সাসপেন্ড ও সাবস্ক্রিপশন টায়ার</p>
            </div>
            <button
              onClick={() => alert('নতুন বাস কোম্পানি অনবোর্ডিং প্রক্রিয়া শুরু হচ্ছে...')}
              className="px-4 py-2 bg-[#FF6B0A] hover:bg-[#E65A00] text-white rounded-xl text-xs font-bold"
            >
              + নতুন টেন্যান্ট যোগ করুন
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">কোম্পানির নাম</th>
                  <th className="px-6 py-3">যোগাযোগ</th>
                  <th className="px-6 py-3">সাবস্ক্রিপশন প্ল্যান</th>
                  <th className="px-6 py-3">ক্যান্সেলেশন ফি</th>
                  <th className="px-6 py-3">স্ট্যাটাস</th>
                  <th className="px-6 py-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {tenantsList.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <strong className="block text-navy-900 text-sm">{tenant.nameBn}</strong>
                      <span className="text-gray-400 text-[11px]">{tenant.name}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="block">{tenant.contactEmail}</span>
                      <span className="text-gray-400 text-[11px] font-mono">{tenant.contactPhone}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-purple-100 text-purple-800">
                        {tenant.subscriptionTier}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold">{tenant.cancellationFeePercent}%</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          tenant.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => toggleTenantStatus(tenant.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                          tenant.status === 'ACTIVE'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {tenant.status === 'ACTIVE' ? 'সাসপেন্ড' : 'অ্যাক্টিভেট'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SaaS Subscription Plans */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-navy-900">প্ল্যাটফর্ম সাবস্ক্রিপশন প্ল্যানসমূহ</h3>
            <p className="text-xs text-gray-500">বাস অপারেটিং কোম্পানিগুলোর জন্য মূল্য ও ফিচার এনটাইটেলমেন্ট</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_PLANS.map((plan) => (
              <div key={plan.id} className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-navy-900">{plan.name}</h4>
                  <span className="text-xs font-mono font-bold text-[#FF6B0A]">
                    {formatPrice(plan.monthlyPrice)}/মাস
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>সর্বোচ্চ বাস: <strong>{plan.maxBuses} টি</strong></p>
                  <p>সর্বোচ্চ কাউন্টার: <strong>{plan.maxCounters} টি</strong></p>
                  <p>স্টাফ অ্যাকাউন্ট: <strong>{plan.maxStaff} জন</strong></p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-2">বৈশিষ্ট্যসমূহ</span>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
