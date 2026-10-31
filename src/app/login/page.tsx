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
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
  X,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  const roleHint = searchParams.get('role');

  const { loginWithCredentials, changePassword, resetPasswordToDefault, superAdminPassword } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('myshaibnatchowdhury@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Change Password Modal State
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [modalMsg, setModalMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

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

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalMsg(null);

    if (newPassword !== confirmPassword) {
      setModalMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!' });
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (res.success) {
      setModalMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' });
      setPassword(newPassword);
      setTimeout(() => {
        setShowChangeModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setModalMsg(null);
      }, 1200);
    } else {
      setModalMsg({ type: 'error', text: res.message });
    }
  };

  const handleResetPassword = () => {
    if (confirm('আপনি কি পাসওয়ার্ড রিসেট করে ডিফল্ট পাসওয়ার্ড (admin123) এ ফিরিয়ে নিতে চান?')) {
      resetPasswordToDefault();
      setPassword('admin123');
      alert('পাসওয়ার্ড রিসেট করে "admin123" সেট করা হয়েছে!');
      setShowChangeModal(false);
    }
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
              <span>সুপার অ্যাডমিন অ্যাক্সেস নীতি (Super Admin Access)</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              সুপার অ্যাডমিন কনসোল শুধুমাত্র <strong>Mysha Ibnat Chowdhury (myshaibnatchowdhury@gmail.com)</strong> এর জন্য নির্ধারিত।
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
            {/* Email Field */}
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

            {/* Password Field with Eye Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-gray-700">পাসওয়ার্ড *</label>
                <button
                  type="button"
                  onClick={() => setShowChangeModal(true)}
                  className="text-[11px] text-[#FF6B0A] hover:underline font-bold flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>পাসওয়ার্ড পরিবর্তন / সেট করুন</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন..."
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />

                {/* Eye Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-700 rounded-md transition-colors"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#FF6B0A]" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                * ডিফল্ট পাসওয়ার্ড: <strong className="font-mono text-gray-600">admin123</strong> (উপরে আইকন চেপে পাসওয়ার্ড পরিবর্তন করা যাবে)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Info & Help */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>সুপার অ্যাডমিন: Mysha Ibnat Chowdhury</span>
            <button
              type="button"
              onClick={() => setShowChangeModal(true)}
              className="text-[#FF6B0A] font-bold hover:underline"
            >
              পাসওয়ার্ড চেঞ্জ
            </button>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95">
            <button
              onClick={() => {
                setShowChangeModal(false);
                setModalMsg(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-navy-900 border-b border-gray-100 pb-3">
              <KeyRound className="w-5 h-5 text-[#FF6B0A]" />
              <div>
                <h3 className="text-base font-bold">পাসওয়ার্ড পরিবর্তন ও সেট করুন</h3>
                <p className="text-[11px] text-gray-400 font-normal">
                  Mysha Ibnat Chowdhury (`myshaibnatchowdhury@gmail.com`)
                </p>
              </div>
            </div>

            {modalMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  modalMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {modalMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>{modalMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              {/* Old Password with Eye Toggle */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  বর্তমান পাসওয়ার্ড (Current Password) *
                </label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন (যেমন: admin123)..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-700"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4 text-[#FF6B0A]" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password with Eye Toggle */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড (New Password) *
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="আপনার পছন্দের নতুন পাসওয়ার্ড লিখুন..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-700"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4 text-[#FF6B0A]" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  পাসওয়ার্ড পরিবর্তন ও সেভ করুন
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">পাসওয়ার্ড ভুলে গেলে?</span>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-[11px] text-red-600 hover:underline font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ডিফল্ট পাসওয়ার্ডে (admin123) রিসেট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
