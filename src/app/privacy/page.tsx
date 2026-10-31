'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />
      <div className="bg-[#071B33] text-white py-12 text-center">
        <h1 className="text-3xl font-black">গোপনীয়তা নীতি (Privacy Policy)</h1>
        <p className="text-xs text-gray-300 mt-2">যাত্রীদের তথ্যের নিরাপত্তা ও ডেটা প্রটেকশন নীতি</p>
      </div>
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow space-y-6 text-xs text-gray-600 leading-relaxed">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900">ব্যক্তিগত তথ্যের সুরক্ষা</h2>
          <p>অরোরা এক্সপ্রেস যাত্রীদের নাম, মোবাইল নম্বর এবং ভ্রমণ সংক্রান্ত তথ্য অত্যন্ত গোপনীয়তার সাথে সংরক্ষণ করে। তৃতীয় কোনো পক্ষের সাথে বাণিজ্যিক উদ্দেশ্যে তথ্য আদান-প্রদান করা হয় না। সমস্ত পেমেন্ট ডেটা ব্যাংকিং গেটওয়ে দ্বারা ২৫৬-বিট এসএসএল এনক্রিপ্ট করা থাকে।</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
