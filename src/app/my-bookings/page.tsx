'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { Booking } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import {
  Search,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

function MyBookingsContent() {
  const searchParams = useSearchParams();
  const initialPnr = searchParams.get('pnr') || '';
  const router = useRouter();
  const { language, formatPrice } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(initialPnr);
  const [results, setResults] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  const performSearch = (q: string) => {
    const clean = q.trim().toUpperCase();
    if (!clean) return;

    setHasSearched(true);
    const found = db.bookings.filter(
      (b) =>
        b.pnr.toUpperCase().includes(clean) ||
        b.passengerPhone.includes(clean) ||
        b.id.toUpperCase().includes(clean)
    );
    setResults(found);
  };

  useEffect(() => {
    if (initialPnr) {
      performSearch(initialPnr);
    } else {
      // Show user's bookings if any
      setResults(db.bookings.slice(0, 5));
    }
  }, [initialPnr]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleCancelConfirm = () => {
    if (!cancelModalBooking) return;

    // Cancellation Policy: 15% cancellation fee
    const fee = Math.round((cancelModalBooking.totalAmount * 15) / 100);
    const refund = cancelModalBooking.totalAmount - fee;

    // Update booking status
    cancelModalBooking.bookingStatus = 'CANCELLED';

    // Release held/booked seats
    for (const seat of cancelModalBooking.seatNumbers) {
      db.seatReservations.delete(`${cancelModalBooking.tripId}:${seat}`);
    }

    // Record refund request
    db.refunds.push({
      id: `ref-${Date.now()}`,
      tenantId: cancelModalBooking.tenantId,
      bookingId: cancelModalBooking.id,
      pnr: cancelModalBooking.pnr,
      requestedBy: cancelModalBooking.passengerName,
      passengerPhone: cancelModalBooking.passengerPhone,
      totalAmount: cancelModalBooking.totalAmount,
      cancellationFee: fee,
      refundableAmount: refund,
      reason: 'Passenger requested online cancellation',
      status: 'APPROVED',
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    });

    // Financial ledger entry for refund debit
    db.ledger.push({
      id: `ledg-ref-${Date.now()}`,
      tenantId: cancelModalBooking.tenantId,
      date: new Date().toISOString(),
      entryType: 'REFUND',
      amount: refund,
      flow: 'DEBIT',
      description: `Refund processed for cancelled PNR ${cancelModalBooking.pnr}`,
      referenceId: cancelModalBooking.pnr,
    });

    setCancelSuccessMsg(
      language === 'bn'
        ? `টিকিট (${cancelModalBooking.pnr}) সফলভাবে বাতিল করা হয়েছে। ১৫% ফি (${formatPrice(fee)}) বাদে ${formatPrice(refund)} রিফান্ড অনুমোদিত হয়েছে।`
        : `Booking ${cancelModalBooking.pnr} has been cancelled. Refund of ${formatPrice(refund)} approved after 15% cancellation fee.`
    );

    setCancelModalBooking(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#071B33] text-white py-10 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black">
              {language === 'bn' ? 'আমার টিকিট ও বুকিং' : 'My Bookings & E-Tickets'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              {language === 'bn'
                ? 'আপনার ৬ সংখ্যার PNR নম্বর বা মোবাইল নম্বর দিয়ে টিকিট খুঁজুন, ডাউনলোড করুন অথবা বাতিল করুন'
                : 'Search your issued tickets by 6-digit PNR code or phone number to view, reprint, or cancel'}
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="PNR (যেমন: AE-784912) অথবা মোবাইল নম্বর..."
                  className="w-full bg-white text-navy-900 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B0A] shadow-md uppercase"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-sm rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>খুঁজুন</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {cancelSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{cancelSuccessMsg}</span>
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">
              {hasSearched
                ? (language === 'bn' ? 'কোনো বুকিং রেকর্ড খুঁজে পাওয়া যায়নি' : 'No Bookings Found')
                : (language === 'bn' ? 'অনুসন্ধান করুন' : 'Search Your Booking')}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              অনুগ্রহ করে সঠিক PNR কোড (যেমন: <strong className="text-navy-900">AE-784912</strong>) প্রদান করে খুঁজুন।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                প্রাপ্ত বুকিং তালিকা ({results.length})
              </span>
            </div>

            {results.map((booking) => {
              const isCancelled = booking.bookingStatus === 'CANCELLED';

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm bg-navy-900 text-white px-2.5 py-0.5 rounded-lg">
                        {booking.pnr}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-red-100 text-red-600'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-navy-900">
                      <span>{booking.trip?.route?.origin}</span>
                      <span className="text-[#FF6B0A]">➔</span>
                      <span>{booking.trip?.route?.destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#FF6B0A]" />
                        <span>{booking.trip?.departureDate} ({booking.trip?.departureTime})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>বোর্ডিং: {booking.boardingPoint}</span>
                      </div>
                      <div>
                        আসন: <strong className="text-navy-900 font-mono">{booking.seatNumbers.join(', ')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6 shrink-0 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                        পরিশোধিত ভাড়া
                      </span>
                      <span className="text-lg font-black text-[#FF6B0A]">
                        {formatPrice(booking.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ticket/${booking.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>টিকিট দেখুন</span>
                      </Link>

                      {!isCancelled && (
                        <button
                          onClick={() => setCancelModalBooking(booking)}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                        >
                          বাতিল করুন
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cancellation & Refund Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-navy-900">টিকিট বাতিল ও রিফান্ড নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              আপনি কি নিশ্চিতভাবে PNR: <strong className="text-navy-900 font-mono">{cancelModalBooking.pnr}</strong> টিকিটটি বাতিল করতে চান?
            </p>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>মূল টিকিট মূল্য:</span>
                <span className="font-bold">{formatPrice(cancelModalBooking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>বাতিল ফি (১৫%):</span>
                <span>- {formatPrice(Math.round((cancelModalBooking.totalAmount * 15) / 100))}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 pt-1.5 border-t border-gray-200 text-sm">
                <span>ফেরতযোগ্য নেট রিফান্ড:</span>
                <span>{formatPrice(cancelModalBooking.totalAmount - Math.round((cancelModalBooking.totalAmount * 15) / 100))}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                না, ফিরে যান
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                হ্যাঁ, বাতিল ও রিফান্ড করুন
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading bookings...</div>}>
      <MyBookingsContent />
    </Suspense>
  );
}
