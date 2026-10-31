'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/i18n';
import Image from 'next/image';
import { Award, ShieldCheck, Clock, Users, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <div className="bg-[#071B33] text-white py-14 border-b border-navy-800 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
            ABOUT AURORA EXPRESS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Aurora Express'}
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            দেশের পথে, আপনার সাথে — নির্ভরযোগ্য, বিলাসবহুল ও নিরাপদ আন্তঃনগর পরিবহন সেবা
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-10">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-4 text-sm text-gray-600 leading-relaxed">
          <h2 className="text-xl font-black text-navy-900">
            আমাদের লক্ষ্য ও ঐতিহ্য
          </h2>
          <p>
            <strong>অরোরা এক্সপ্রেস (Aurora Express)</strong> বাংলাদেশের আন্তঃনগর সড়ক যোগাযোগে এক নতুন দিগন্ত উন্মোচন করেছে। রাজধানী ঢাকা থেকে চট্টগ্রাম, কক্সবাজার, সিলেট এবং রাজশাহী রুটে সর্বাধুনিক প্রযুক্তি ও বিশ্বমানের ইউরোপীয় কোচের মাধ্যমে যাত্রীদের যাত্রা আনন্দদায়ক ও নির্বিঘ্ন করাই আমাদের মূল অঙ্গীকার।
          </p>
          <p>
            আমাদের প্রতিটি বাসে রয়েছে হাই-স্পিড ওয়াইফাই, জিপিএস ট্র্যাকিং, আরামদায়ক রিক্লাইনার সিট এবং সার্বক্ষণিক সিসিটিভি নজরদারি। যাত্রীদের মূল্যবান সময়কে প্রাধান্য দিয়ে প্রতিটি বাস নির্ধারিত সময়ে যাত্রা শুরু ও সমাপ্ত করে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">নিরাপত্তা প্রথম</h3>
            <p className="text-xs text-gray-500">প্রশিক্ষিত ক্যাপ্টেন ও কঠোর গতিসীমা মেনে চলা হয়।</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2">
            <Clock className="w-8 h-8 text-[#FF6B0A] mx-auto" />
            <h3 className="text-base font-bold text-navy-900">সময়ানুবর্তিতা</h3>
            <p className="text-xs text-gray-500">নির্ভুল শিডিউল ও অন-টাইম ডিপার্চার নিশ্চয়তা।</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2">
            <HeartHandshake className="w-8 h-8 text-blue-600 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">২৪/৭ যাত্রীসেবা</h3>
            <p className="text-xs text-gray-500">যেকোনো তথ্য ও সহযোগিতায় পাশে রয়েছে ডেডিকেটেড টিম।</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
