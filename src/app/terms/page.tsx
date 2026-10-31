'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />
      <div className="bg-[#071B33] text-white py-12 text-center">
        <h1 className="text-3xl font-black">ব্যবহারের সাধারণ শর্তাবলী</h1>
        <p className="text-xs text-gray-300 mt-2">অরোরা এক্সপ্রেস অনলাইন প্ল্যাটফর্ম ও বাস সার্ভিস ব্যবহারের নিয়মাবলী</p>
      </div>
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow space-y-6 text-xs text-gray-600 leading-relaxed">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900">১. টিকিট ক্রয় ও সত্যতা</h2>
          <p>অনলাইনে বা অনুমোদিত কাউন্টার ব্যতীত অন্য কোনো অবৈধ বা অননুমোদিত উৎস থেকে সংগৃহীত টিকিটের জন্য কর্তৃপক্ষ দায়ী থাকবে না।</p>
          <h2 className="text-base font-bold text-navy-900 pt-2">২. লাগেজ ও মালামাল পরিবহন</h2>
          <p>প্রতিজন যাত্রী সর্বোচ্চ ২০ কেজি মালামাল বহন করতে পারবেন। কোনো প্রকার দাহ্য, অবৈধ বা নিষিদ্ধ দ্রব্যাদি কোচে বহন সম্পূর্ণ নিষিদ্ধ।</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
