'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PaymentSimulator from '@/components/payment/PaymentSimulator';
import { db } from '@/lib/db';
import { Trip } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Bus, MapPin, Calendar, Clock } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get('tripId');
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [pendingData, setPendingData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('aurora_pending_booking');
    if (raw) {
      const parsed = JSON.parse(raw);
      setPendingData(parsed);
      const foundTrip = db.trips.find((t) => t.id === parsed.tripId);
      if (foundTrip) setTrip(foundTrip);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!pendingData || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading checkout session...</p>
      </div>
    );
  }

  const handlePaymentSuccess = (paymentDetails: {
    gateway: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH';
    transactionRef: string;
  }) => {
    setIsProcessing(true);

    const result = db.confirmBooking({
      tripId: trip.id,
      seatNumbers: pendingData.seatNumbers,
      sessionId: pendingData.sessionId,
      passengerName: pendingData.passengerName,
      passengerPhone: pendingData.passengerPhone,
      passengerEmail: pendingData.passengerEmail,
      passengerGender: pendingData.passengerGender,
      boardingPoint: pendingData.boardingPoint,
      droppingPoint: pendingData.droppingPoint,
      paymentMethod: paymentDetails.gateway,
      transactionRef: paymentDetails.transactionRef,
      bookedVia: 'ONLINE',
      userId: user?.id,
    });

    if (result.success && result.booking) {
      sessionStorage.removeItem('aurora_pending_booking');
      router.push(`/ticket/${result.booking.id}`);
    } else {
      alert(result.message || 'Payment confirmation failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Booking Summary Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 rounded bg-navy-900 text-white font-mono text-xs font-bold">
                {trip.bus?.coachNumber}
              </span>
              <span className="font-bold text-navy-900 text-sm">
                {trip.route?.origin} ➔ {trip.route?.destination}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              যাত্রী: <strong className="text-navy-900">{pendingData.passengerName}</strong> ({pendingData.passengerPhone}) • আসন: <strong className="text-[#FF6B0A] font-mono">{pendingData.seatNumbers.join(', ')}</strong>
            </p>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-xs text-gray-400 uppercase font-semibold block">
              মোট প্রদেয় বিল
            </span>
            <span className="text-2xl font-black text-[#FF6B0A]">
              {formatPrice(pendingData.totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Simulator Component */}
        <PaymentSimulator
          amount={pendingData.totalAmount}
          bookingRef={`TEMP-${trip.id.slice(0, 8)}`}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => router.back()}
        />
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
