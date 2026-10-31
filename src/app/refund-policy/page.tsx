'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/i18n';
import { RotateCcw, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

export default function RefundPolicyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <div className="bg-[#071B33] text-white py-12 border-b border-navy-800 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
            POLICY ENGINE & GUIDELINES
          </span>
          <h1 className="text-3xl font-black">
            টিকিট বাতিল ও রিফান্ড নীতি
          </h1>
          <p className="text-xs text-gray-300 mt-2">
            অরোরা এক্সপ্রেস ক্যান্সেলেশন ফি ও অর্থ ফেরত সংক্রান্ত বিধিমালার বিস্তারিত বিবরণ
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-8 text-xs text-gray-600 leading-relaxed">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-navy-900">
            <RotateCcw className="w-5 h-5 text-[#FF6B0A]" />
            <h2 className="text-base font-bold">১. টিকিট বাতিলের যোগ্যতা ও সময়সীমা</h2>
          </div>
          <p>
            সম্মানিত যাত্রীগণ বাস ডিপার্চারের নির্ধারিত সময়ের <strong>সর্বনিম্ন ৬ ঘণ্টা পূর্বে</strong> অনলাইনে &quot;আমার বুকিং&quot; পেজ অথবা যে কাউন্টার থেকে টিকিট ক্রয় করেছেন সেখানে গিয়ে টিকিট বাতিলের আবেদন করতে পারবেন। ডিপার্চারের ৬ ঘণ্টার কম সময় অবশিষ্ট থাকলে টিকিট বাতিল বা রিফান্ড প্রযোজ্য হবে না।
          </p>

          <div className="flex items-center gap-2 text-navy-900 pt-4 border-t border-gray-100">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold">২. ক্যান্সেলেশন ফি ও অর্থ ফেরতের নিয়মাবলী</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>স্ট্যান্ডার্ড নীতিমালা অনুযায়ী মূল ভাড়ার <strong>১৫% ক্যান্সেলেশন সার্ভিস ফি</strong> কর্তন করা হবে।</li>
            <li>অবশিষ্ট ৮৫% অর্থ স্বয়ংক্রিয়ভাবে আপনার পেমেন্টকৃত মাধ্যমে (বিকাশ/নগদ/কার্ড) বা কাউন্টারে ক্যাশ ফেরত প্রদান করা হবে।</li>
            <li>এমএফএস (বিকাশ/নগদ) রিফান্ড সাধারণত ২৪ থেকে ৪৮ কর্মঘণ্টার মধ্যে সংশ্লিষ্ট ওয়ালেটে জমা হয়।</li>
          </ul>

          <div className="flex items-center gap-2 text-navy-900 pt-4 border-t border-gray-100">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold">৩. বিশেষ ছুটির দিন ও ঈদ সার্ভিস নীতিমালা</h2>
          </div>
          <p>
            পবিত্র ঈদুল ফিতর ও ঈদুল আজহার স্পেশাল ট্রিপসমূহের ক্ষেত্রে বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA) কর্তৃক আরোপিত বিশেষ বিধিনিষেধ প্রযোজ্য হতে পারে।
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
