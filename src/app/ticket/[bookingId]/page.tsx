'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TicketView from '@/components/ticket/TicketView';
import { db } from '@/lib/db';
import { Booking } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Ticket as TicketIcon } from 'lucide-react';

function TicketContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = db.bookings.find((b) => b.id === bookingId || b.pnr.toUpperCase() === bookingId.toUpperCase());
    if (found) {
      setBooking(found);
    }
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6B0A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Navbar />
        <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-2xl border border-gray-200 text-center space-y-4">
          <TicketIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <h2 className="text-lg font-bold text-navy-900">টিকিট পাওয়া যায়নি</h2>
          <p className="text-xs text-gray-500">
            নির্দিষ্ট বুকিং আইডি বা PNR রেকর্ড আমাদের সিস্টেমে খুঁজে পাওয়া যায়নি।
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B0A] text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <TicketView booking={booking} />
      </main>

      <Footer />
    </div>
  );
}

export default function TicketPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading ticket...</div>}>
      <TicketContent />
    </Suspense>
  );
}
