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
  ShieldAlert,
  Building2,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Settings,
  Sliders,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  X,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminPlatformPage() {
  const { user, changePassword, superAdminPassword, resetPasswordToDefault } = useAuth();
  const { language, formatPrice } = useLanguage();
  const [tenantsList, setTenantsList] = useState(db.tenants);

  // Password Modal in Platform
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মিলছে না!' });
      return;
    }
    const res = changePassword(oldPass, newPass);
    if (res.success) {
      setPassMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setOldPass('');
        setNewPass('');
        setConfirmPass('');
        setPassMsg(null);
      }, 1200);
    } else {
      setPassMsg({ type: 'error', text: res.message });
    }
  };

  const isSuperAdminAuthorized = Boolean(
    user &&
    user.email?.toLowerCase() === 'myshaibnatchowdhury@gmail.com' &&
    user.role === 'platform_super_admin'
  );

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

  if (!isSuperAdminAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Navbar />

        <main className="max-w-md mx-auto px-4 py-20 flex-grow w-full flex items-center justify-center">
          <div className="bg-white rounded-3xl border-2 border-red-200 shadow-2xl p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-black text-navy-900">
                সুপার অ্যাডমিন অ্যাক্সেস সংরক্ষিত
              </h1>
              <p className="text-xs text-red-600 font-semibold">
                Unauthorized Access Blocked (403 Forbidden)
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              এই SaaS সেন্ট্রাল প্ল্যাটফর্মটি শুধুমাত্র <strong>Mysha Ibnat Chowdhury (myshaibnatchowdhury@gmail.com)</strong> এর জন্য নির্ধারিত। অন্য কোনো ব্যবহারকারী এই কনসোলে প্রবেশ করতে পারবেন না।
            </p>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 text-left border border-gray-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">বর্তমান সক্রিয় ব্যবহারকারী:</span>
              <p className="font-bold text-navy-900">{user?.fullName || 'অজ্ঞাত ব্যবহারকারী'}</p>
              <p className="font-mono text-gray-500 text-[11px]">{user?.email || 'N/A'}</p>
              <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold rounded bg-gray-200 text-gray-700">
                ভূমিকা: {user?.role ? user.role.toUpperCase() : 'NONE'}
              </span>
            </div>

            <Link
              href="/login?role=superadmin"
              className="w-full py-3.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Mysha Ibnat Chowdhury হিসেবে সাইন-ইন করুন</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

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
              সুপার অ্যাডমিনিস্ট্রেটর: <strong>Mysha Ibnat Chowdhury</strong> (myshaibnatchowdhury@gmail.com)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-navy-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <KeyRound className="w-4 h-4 text-navy-950" />
              <span>পাসওয়ার্ড পরিবর্তন (Change Password)</span>
            </button>

            <div className="px-4 py-2 bg-navy-900 border border-navy-800 rounded-xl text-xs text-gray-300">
              প্ল্যাটফর্ম ভার্সন: <strong>v2.4 LTS</strong> (Multi-Tenant RLS Enabled)
            </div>
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

      {/* Super Admin Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 text-xs">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPassMsg(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-navy-900 border-b border-gray-100 pb-3">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-navy-900">সুপার অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h3>
                <p className="text-[11px] text-gray-400 font-normal">
                  Mysha Ibnat Chowdhury (`myshaibnatchowdhury@gmail.com`)
                </p>
              </div>
            </div>

            {passMsg && (
              <div
                className={`p-3 rounded-xl font-semibold flex items-center gap-2 ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {passMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  বর্তমান পাসওয়ার্ড (Current Password) *
                </label>
                <div className="relative">
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ড দিন..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-700"
                    title={showOld ? 'লুকান' : 'দেখুন'}
                  >
                    {showOld ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড (New Password) *
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="আপনার নতুন পাসওয়ার্ড দিন..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-700"
                    title={showNew ? 'লুকান' : 'দেখুন'}
                  >
                    {showNew ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *
                </label>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="পুনরায় নতুন পাসওয়ার্ড দিন..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                নতুন পাসওয়ার্ড সেট ও সেভ করুন
              </button>
            </form>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-400">ডিফল্ট পাসওয়ার্ড: admin123</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('পাসওয়ার্ড রিসেট করে admin123 করতে চান?')) {
                    resetPasswordToDefault();
                    alert('পাসওয়ার্ড রিসেট করে admin123 করা হয়েছে!');
                    setShowPasswordModal(false);
                  }
                }}
                className="text-red-600 hover:underline font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট (admin123)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
