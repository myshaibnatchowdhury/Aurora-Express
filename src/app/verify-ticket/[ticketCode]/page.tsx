'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { Booking } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Bus,
  ArrowLeft,
} from 'lucide-react';

function VerifyTicketContent() {
  const params = useParams();
  const ticketCode = params.ticketCode as string;
  const { language, formatPrice } = useLanguage();

  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    booking?: Booking;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (ticketCode) {
      const res = db.verifyTicket(ticketCode);
      setVerificationResult(res);
    }
  }, [ticketCode]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {verificationResult?.verified && verificationResult.booking ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Verified Header */}
            <div className="bg-emerald-600 text-white p-6 sm:p-8 text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black">
                {language === 'bn' ? 'বৈধ ও সঠিক টিকিট' : 'Valid & Verified E-Ticket'}
              </h1>
              <p className="text-xs text-emerald-100">
                অরোরা এক্সপ্রেস অফিসিয়াল সেন্ট্রাল সিস্টেম দ্বারা অনুমোদিত
              </p>
            </div>

            {/* Ticket Information */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">PNR CODE</span>
                  <span className="text-xl font-black font-mono text-navy-900 tracking-wider">
                    {verificationResult.booking.pnr}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">বুকিং স্ট্যাটাস</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {verificationResult.booking.bookingStatus}
                  </span>
                </div>
              </div>

              {/* Journey details */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-base font-bold text-navy-900">
                  <span>{verificationResult.booking.trip?.route?.origin}</span>
                  <span className="text-[#FF6B0A]">➔</span>
                  <span>{verificationResult.booking.trip?.route?.destination}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6B0A]" />
                    <span>{verificationResult.booking.trip?.departureDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF6B0A]" />
                    <span>{verificationResult.booking.trip?.departureTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>বোর্ডিং: {verificationResult.booking.boardingPoint}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-navy-900" />
                    <span>কোচ: {verificationResult.booking.trip?.bus?.coachNumber}</span>
                  </div>
                </div>
              </div>

              {/* Passenger & Seats */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[10px] block">যাত্রীর নাম</span>
                  <p className="font-bold text-navy-900 text-sm mt-0.5">{verificationResult.booking.passengerName}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[10px] block">বরাদ্দকৃত আসনসমূহ</span>
                  <p className="font-bold text-[#FF6B0A] font-mono text-sm mt-0.5">
                    {verificationResult.booking.seatNumbers.join(', ')}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">পরিশোধিত মোট ভাড়া:</span>
                <span className="font-black text-navy-900 text-base">
                  {formatPrice(verificationResult.booking.totalAmount)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
              <Link
                href="/"
                className="text-xs font-bold text-navy-900 hover:text-[#FF6B0A] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>অরোরা এক্সপ্রেস হোমপেজ</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 stroke-[2]" />
            </div>
            <h1 className="text-xl font-black text-navy-900">
              {language === 'bn' ? 'টিকিট ভেরিফিকেশন ব্যর্থ' : 'Verification Failed'}
            </h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {verificationResult?.message || 'প্রদত্ত QR কোড বা টোকেনটি সঠিক নয় অথবা টিকিটটি ইতিমধ্যে বাতিল করা হয়েছে।'}
            </p>
            <div className="pt-4">
              <Link
                href="/my-bookings"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold"
              >
                <span>PNR দিয়ে পুনরায় খুঁজুন</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyTicketPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Verifying ticket...</div>}>
      <VerifyTicketContent />
    </Suspense>
  );
}
