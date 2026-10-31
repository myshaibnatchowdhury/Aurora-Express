'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/i18n';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <div className="bg-[#071B33] text-white py-12 border-b border-navy-800 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
            24/7 CUSTOMER SUPPORT
          </span>
          <h1 className="text-3xl font-black">
            {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2">
            যেকোনো বুকিং, টিকিট সংক্রান্ত জিজ্ঞাসা বা অভিযোগের জন্য আমাদের সাথে যোগাযোগ করুন
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-gray-100">
                কেন্দ্রীয় প্রধান কার্যালয়
              </h2>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FF6B0A] shrink-0 mt-0.5" />
                  <span>লেভেল ৪, গাবতলী বাস টার্মিনাল বাণিজ্যিক ভবন, ঢাকা-১২১৬, বাংলাদেশ</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-bold text-navy-900">হটলাইন: ১৬২৬৩ / ০৯৬১২-৩৩৪৫৫৬</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>support@auroraexpress.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>সাপোর্ট ডেস্ক: ২৪ ঘণ্টা, সপ্তাহে ৭ দিন উন্মুক্ত</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200 space-y-2 text-xs">
              <h3 className="font-bold text-orange-900">জরুরি অভিযোগ সেল</h3>
              <p className="text-orange-800 leading-relaxed">
                বাসে কোনো অনাকাঙ্ক্ষিত বিলম্ব বা সেবামূলক অসঙ্গতি লক্ষ্য করলে আমাদের হটলাইনে সরাসরি ডায়াল করে সংশ্লিষ্ট ট্রিপ নম্বর বা PNR উল্লেখ করুন।
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-navy-900 mb-4">বার্তা পাঠান</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('আপনার বার্তা সফলভাবে গৃহীত হয়েছে। আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন।'); }} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">আপনার নাম *</label>
                <input type="text" placeholder="পুরো নাম লিখুন..." className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B0A]" required />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">মোবাইল নম্বর *</label>
                <input type="tel" placeholder="017XXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6B0A]" required />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">বার্তা বা জিজ্ঞাস্য *</label>
                <textarea rows={4} placeholder="আপনার বক্তব্য লিখুন..." className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B0A]" required />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold flex items-center justify-center gap-2 shadow-md">
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
