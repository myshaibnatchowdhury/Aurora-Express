'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBooking from '@/components/home/HeroBooking';
import ServiceHighlights from '@/components/home/ServiceHighlights';
import PopularRoutes from '@/components/home/PopularRoutes';
import PromoBanner from '@/components/home/PromoBanner';
import { useLanguage } from '@/lib/i18n';
import {
  ShieldCheck,
  Award,
  Zap,
  HelpCircle,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section & Booking Bar */}
        <HeroBooking />

        {/* 5 Service Feature Highlights */}
        <ServiceHighlights />

        {/* Popular Routes */}
        <PopularRoutes />

        {/* Promotional Stats & Confidence Banner */}
        <PromoBanner />

        {/* Why Choose Aurora Express */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900">
              {language === 'bn' ? 'কেন বেছে নেবেন অরোরা এক্সপ্রেস?' : 'Why Choose Aurora Express?'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {language === 'bn'
                ? 'বাংলাদেশের প্রধান মহাসড়কগুলোতে নিরাপদ, বিলাসবহুল ও আনন্দদায়ক আন্তঃনগর যাতায়াত'
                : 'Experience reliable, luxurious, and punctually driven intercity transit across Bangladesh'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B0A] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">
                {language === 'bn' ? 'আধুনিক বিলাসবহুল বহর' : 'Premium Modern Fleet'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {language === 'bn'
                  ? 'স্ক্যানিয়া মাল্টি-অ্যাক্সেল এবং হুন্দাই ইউনিভার্স লাক্সারি কোচে ফুল-রিক্লাইনার আসন ও উন্নত এয়ার সাসপেনশন।'
                  : 'Scania Multi-Axle and Hyundai Universe coaches featuring full-recliner seats and advanced air suspension.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">
                {language === 'bn' ? 'শতভাগ নিরাপদ ও জিও-ট্র্যাকড' : '100% Safe & GPS Monitored'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {language === 'bn'
                  ? 'দক্ষ ও প্রশিক্ষিত চালক, হাইওয়ে স্পিড মনিটরিং এবং সার্বক্ষণিক সিসিটিভি নজরদারি।'
                  : 'Experienced vetted captains, 24/7 highway speed monitoring, and in-cabin security surveillance.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">
                {language === 'bn' ? 'দ্রুত ডিজিটাল বুকিং ও টিকিট' : 'Fast Digital E-Tickets'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {language === 'bn'
                  ? 'বিকাশ, নগদ বা কার্ড দিয়ে তাৎক্ষণিক টিকিট নিশ্চিতকরণ এবং সুরক্ষিত QR ভেরিফিকেশন ব্যবস্থা।'
                  : 'Instant seat confirmation via bKash, Nagad, or cards with cryptographically secure QR verification.'}
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="bg-white border-t border-gray-200/60 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-[#FF6B0A] uppercase tracking-wider block mb-1">
                FAQ
              </span>
              <h2 className="text-2xl font-black text-navy-900">
                {language === 'bn' ? 'সাধারণ জিজ্ঞাসাসমূহ' : 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF6B0A]" />
                  <span>
                    {language === 'bn'
                      ? 'টিকিট বুকিং করার পর কীভাবে টিকিট সংগ্রহ করব?'
                      : 'How do I receive my ticket after online booking?'}
                  </span>
                </h4>
                <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
                  {language === 'bn'
                    ? 'পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই আপনার স্ক্রিনে অফিসিয়াল E-Ticket এবং QR কোড প্রদর্শিত হবে। আপনি এটি সরাসরি ডাউনলোড বা প্রিন্ট করতে পারবেন। পাশাপাশি PNR কোড দিয়ে যেকোনো সময় "আমার বুকিং" পেজ থেকে টিকিটটি দেখা যাবে।'
                    : 'Immediately upon successful payment, your official digital E-Ticket with QR code is generated. You can download or print it instantly, or view it anytime under "My Bookings" using your PNR.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF6B0A]" />
                  <span>
                    {language === 'bn'
                      ? 'টিকিট বাতিল ও রিফান্ডের নিয়ম কী?'
                      : 'What is the ticket cancellation and refund policy?'}
                  </span>
                </h4>
                <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
                  {language === 'bn'
                    ? 'বাস ছাড়ার সর্বনিম্ন ৬ ঘণ্টা পূর্বে টিকিট বাতিল আবেদন করা যাবে। নিয়ম অনুযায়ী ১৫% ক্যান্সেলেশন ফি বাদে বাকি টাকা আপনার মূল পেমেন্ট মেথডে বা কাউন্টার থেকে ফেরত দেওয়া হবে।'
                    : 'Tickets can be cancelled up to 6 hours before scheduled departure. Subject to standard 15% cancellation fee, the balance is promptly refunded to your original payment channel.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF6B0A]" />
                  <span>
                    {language === 'bn'
                      ? 'কাউন্টারে কি নগদ অর্থে টিকিট কেনা যাবে?'
                      : 'Can I purchase tickets with cash at physical counters?'}
                  </span>
                </h4>
                <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
                  {language === 'bn'
                    ? 'হ্যাঁ, আমাদের গাবতলী, সায়েদাবাদ, দামপাড়া, কলাতলীসহ সারা দেশে ১০০টিরও বেশি নিজস্ব কাউন্টারে নগদ টাকা বা মোবাইল পেমেন্টে তাৎক্ষণিক টিকিট বুকিং করা যায়।'
                    : 'Yes! All 100+ Aurora Express counter branches in Dhaka, Chittagong, Cox\'s Bazar, Sylhet and Rajshahi accept cash and MFS with instant thermal printouts.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
