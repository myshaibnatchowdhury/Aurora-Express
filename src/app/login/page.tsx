'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Sparkles,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  const roleHint = searchParams.get('role');

  const { loginWithCredentials, loginAs, user, isSuperAdmin } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState(
    roleHint === 'superadmin' ? 'myshaibnatchowdhury@gmail.com' : 'myshaibnatchowdhury@gmail.com'
  );
  const [password, setPassword] = useState('••••••••');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // Check if trying to access superadmin with another email
    if (roleHint === 'superadmin' && cleanEmail !== 'myshaibnatchowdhury@gmail.com') {
      setErrorMsg('অননুমোদিত চেষ্টা: শুধুমাত্র Mysha Ibnat Chowdhury (myshaibnatchowdhury@gmail.com) সুপার অ্যাডমিন হিসেবে প্রবেশ করতে পারবেন।');
      return;
    }

    const res = loginWithCredentials(cleanEmail, password);
    if (res.success) {
      setSuccessMsg('লগইন সফল হয়েছে! রিডাইরেক্ট করা হচ্ছে...');
      setTimeout(() => {
        if (cleanEmail === 'myshaibnatchowdhury@gmail.com') {
          router.push('/platform');
        } else if (returnTo) {
          router.push(returnTo);
        } else {
          router.push('/');
        }
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLoginSuperAdmin = () => {
    setEmail('myshaibnatchowdhury@gmail.com');
    loginAs('user-superadmin');
    setSuccessMsg('সুপার অ্যাডমিন Mysha Ibnat Chowdhury হিসেবে লগইন সম্পন্ন হয়েছে!');
    setTimeout(() => {
      router.push('/platform');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="relative h-12 w-48 mx-auto">
              <Image
                src="/images/aurora-header-logo.png"
                alt="Aurora Express"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-navy-900">
              অ্যাকাউন্টে সাইন-ইন করুন
            </h1>
            <p className="text-xs text-gray-500">
              অরোরা এক্সপ্রেস সেন্ট্রাল অথেন্টিকেশন গেটওয়ে
            </p>
          </div>

          {/* Super Admin Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>সুপার অ্যাডমিন অ্যাক্সেস নীতি (Super Admin Security)</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              প্ল্যাটফর্মের সুপার অ্যাডমিন প্যানেল শুধুমাত্র <strong>Mysha Ibnat Chowdhury (myshaibnatchowdhury@gmail.com)</strong> এর জন্য নির্ধারিত ও সংরক্ষিত।
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">ইমেইল অ্যাড্রেস *</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">পাসওয়ার্ড *</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dedicated Super Admin 1-Click Access for Mysha Ibnat Chowdhury */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleQuickLoginSuperAdmin}
              className="w-full py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Mysha Ibnat Chowdhury (Super Admin লগইন)</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
