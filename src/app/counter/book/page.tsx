'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SeatSelector from '@/components/booking/SeatSelector';
import { db } from '@/lib/db';
import { Trip } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  Store,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Bus,
  Banknote,
  Smartphone,
  CreditCard,
} from 'lucide-react';

export default function CounterBookPOSPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();

  const [activeTripId, setActiveTripId] = useState(db.trips[0]?.id || '');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BKASH' | 'CARD'>('CASH');
  const [boardingStop, setBoardingStop] = useState('');
  const [droppingStop, setDroppingStop] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedTrip = db.trips.find((t) => t.id === activeTripId);
  const sessionId = `cnt-pos-${user?.id || 'gabtoli'}`;

  const subtotal = (selectedTrip?.baseFare || 0) * selectedSeats.length;

  const handlePOSConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedTrip) return;
    if (selectedSeats.length === 0) {
      setErrorMsg('অনুগ্রহ করে অন্তত ১টি আসন নির্বাচন করুন।');
      return;
    }
    if (!passengerName.trim() || !passengerPhone.trim()) {
      setErrorMsg('যাত্রীর নাম এবং মোবাইল নম্বর আবশ্যক।');
      return;
    }

    setIsSubmitting(true);

    const bStop = boardingStop || selectedTrip.route?.stops[0]?.stopName || 'Counter Main';
    const dStop = droppingStop || selectedTrip.route?.stops[selectedTrip.route.stops.length - 1]?.stopName || 'Destination Terminal';

    const result = db.confirmBooking({
      tripId: selectedTrip.id,
      seatNumbers: selectedSeats,
      sessionId,
      passengerName,
      passengerPhone,
      boardingPoint: bStop,
      droppingPoint: dStop,
      paymentMethod,
      bookedVia: 'COUNTER',
      counterId: user?.counterId || 'cnt-gabtoli',
      userId: user?.id,
    });

    if (result.success && result.booking) {
      router.push(`/ticket/${result.booking.id}`);
    } else {
      setErrorMsg(result.message || 'বুকিং ব্যর্থ হয়েছে।');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* POS Screen Header */}
      <div className="bg-[#071B33] text-white py-6 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
              FAST COUNTER TICKETING POS
            </span>
            <h1 className="text-2xl font-black">
              কাউন্টার দ্রুত টিকিট ইস্যু
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">ট্রিপ নির্বাচন:</span>
            <select
              value={activeTripId}
              onChange={(e) => {
                setActiveTripId(e.target.value);
                setSelectedSeats([]);
              }}
              className="bg-navy-800 border border-navy-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#FF6B0A]"
            >
              {db.trips.slice(0, 6).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.bus?.coachNumber} ({t.departureTime}) - {t.route?.origin} ➔ {t.route?.destination} (৳{t.baseFare})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {selectedTrip && (
          <form onSubmit={handlePOSConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Seat Map */}
            <div className="lg:col-span-7">
              <SeatSelector
                trip={selectedTrip}
                sessionId={sessionId}
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
                maxSeats={6}
              />
            </div>

            {/* Right: Fast Passenger Input & Cash Drawer */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span>কাউন্টার টিকিট বিবরণ</span>
                  <span className="text-[#FF6B0A] font-mono">{selectedTrip.bus?.coachNumber}</span>
                </h3>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">যাত্রীর নাম *</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="নাম লিখুন..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                    required
                  />
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">পেমেন্ট মেথড *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'CASH'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>ক্যাশ (Cash)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('BKASH')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'BKASH'
                          ? 'border-[#E2136E] bg-pink-50 text-[#E2136E]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-[#E2136E]" />
                      <span>bKash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'CARD'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>কার্ড (Card)</span>
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-900">
                    মোট আদায়যোগ্য ({selectedSeats.length} টি আসন)
                  </span>
                  <span className="text-xl font-black text-[#FF6B0A]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || selectedSeats.length === 0}
                  className="w-full py-3.5 rounded-xl bg-[#071B33] hover:bg-[#0D2B52] disabled:bg-gray-300 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>ইস্যু ও সরাসরি প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
