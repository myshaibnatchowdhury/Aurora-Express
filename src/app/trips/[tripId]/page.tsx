'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SeatSelector from '@/components/booking/SeatSelector';
import { db } from '@/lib/db';
import { Trip, Booking } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  Calendar,
  Clock,
  MapPin,
  Bus,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

function TripDetailContent() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;
  const { language, formatPrice } = useLanguage();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  // Passenger Form State
  const [passengerName, setPassengerName] = useState(user?.fullName || '');
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || '');
  const [passengerGender, setPassengerGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [boardingPoint, setBoardingPoint] = useState<string>('');
  const [droppingPoint, setDroppingPoint] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Unique browser session ID for concurrency locking
    let sid = sessionStorage.getItem('aurora_booking_sid');
    if (!sid) {
      sid = `sid-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('aurora_booking_sid', sid);
    }
    setSessionId(sid);

    const foundTrip = db.trips.find((t) => t.id === tripId);
    if (foundTrip) {
      setTrip(foundTrip);
      // Default boarding and dropping stops
      const boardingStops = foundTrip.route?.stops.filter(
        (s) => s.stopType === 'BOARDING' || s.stopType === 'BOTH'
      );
      const droppingStops = foundTrip.route?.stops.filter(
        (s) => s.stopType === 'DROPPING' || s.stopType === 'BOTH'
      );
      if (boardingStops && boardingStops.length > 0) {
        setBoardingPoint(boardingStops[0].stopName);
      }
      if (droppingStops && droppingStops.length > 0) {
        setDroppingPoint(droppingStops[droppingStops.length - 1].stopName);
      }
    }
  }, [tripId, user]);

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
        <Navbar />
        <div className="py-24 text-center">
          <p className="text-gray-500 font-medium">Trip not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = trip.baseFare * selectedSeats.length;
  const serviceFee = trip.serviceFee * selectedSeats.length;
  const totalPayable = subtotal + serviceFee;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedSeats.length === 0) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে কমপক্ষে ১টি আসন নির্বাচন করুন।'
          : 'Please select at least 1 seat.'
      );
      return;
    }

    if (!passengerName.trim() || !passengerPhone.trim()) {
      setErrorMsg(
        language === 'bn'
          ? 'যাত্রীর নাম এবং মোবাইল নম্বর প্রদান করা আবশ্যক।'
          : 'Passenger name and phone number are required.'
      );
      return;
    }

    setIsSubmitting(true);

    // Create a temporary booking or hold record
    // Store in session storage and navigate to payment simulator
    const pendingBooking = {
      tripId: trip.id,
      seatNumbers: selectedSeats,
      sessionId,
      passengerName,
      passengerPhone,
      passengerEmail,
      passengerGender,
      boardingPoint,
      droppingPoint,
      totalAmount: totalPayable,
    };

    sessionStorage.setItem('aurora_pending_booking', JSON.stringify(pendingBooking));
    router.push(`/payment/checkout?tripId=${trip.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Trip Header Banner */}
      <div className="bg-[#071B33] text-white py-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#FF6B0A] text-white font-mono text-xs font-bold">
                  {trip.bus?.coachNumber}
                </span>
                <span className="text-xs bg-navy-800 text-gray-300 px-3 py-1 rounded-full font-medium">
                  {trip.bus?.model} ({trip.bus?.busType.replace('_', ' ')})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">
                {trip.route?.origin} ➔ {trip.route?.destination}
              </h1>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF6B0A]" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                    তারিখ
                  </span>
                  <span className="font-bold">{trip.departureDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF6B0A]" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                    সময়
                  </span>
                  <span className="font-bold">{trip.departureTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Bus Seat Selector */}
          <div className="lg:col-span-7">
            <SeatSelector
              trip={trip}
              sessionId={sessionId}
              selectedSeats={selectedSeats}
              onSeatSelect={setSelectedSeats}
              maxSeats={4}
            />

            {/* Boarding Instructions & Rules */}
            <div className="mt-6 bg-white p-5 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-navy-900">
                <Info className="w-4 h-4 text-[#FF6B0A]" />
                <span>বুকিং ও ভ্রমণ সংক্রান্ত সাধারণ তথ্যাবলী</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-500">
                <li>সিট নির্বাচন করার পর ১০ মিনিট পর্যন্ত তা অন্য কোনো যাত্রীর জন্য ব্লক থাকবে।</li>
                <li>নির্দিষ্ট সময়ের মধ্যে পেমেন্ট সম্পন্ন না করলে সিট পুনরায় উন্মুক্ত হয়ে যাবে।</li>
                <li>যাত্রার সময় আপনার ডিজিটাল টিকিট বা এসএমএস কনফার্মেশন প্রদর্শন আবশ্যক।</li>
              </ul>
            </div>
          </div>

          {/* Right: Passenger Form & Fare Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-navy-900 pb-3 border-b border-gray-100">
                {language === 'bn' ? 'যাত্রীর তথ্য প্রদান করুন' : 'Passenger Details'}
              </h3>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'যাত্রীর পুরো নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="যেমন: কামরুল হাসান"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Phone Number *'}
                </label>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="01817-XXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                />
              </div>

              {/* Boarding Point */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'বোর্ডিং পয়েন্ট (উঠা) *' : 'Boarding Point *'}
                </label>
                <select
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-navy-900 bg-gray-50 focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                >
                  {trip.route?.stops
                    .filter((s) => s.stopType === 'BOARDING' || s.stopType === 'BOTH')
                    .map((stop) => (
                      <option key={stop.id} value={stop.stopName}>
                        {stop.stopName}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dropping Point */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'ড্রপিং পয়েন্ট (নামা) *' : 'Dropping Point *'}
                </label>
                <select
                  value={droppingPoint}
                  onChange={(e) => setDroppingPoint(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-navy-900 bg-gray-50 focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                >
                  {trip.route?.stops
                    .filter((s) => s.stopType === 'DROPPING' || s.stopType === 'BOTH')
                    .map((stop) => (
                      <option key={stop.id} value={stop.stopName}>
                        {stop.stopName}
                      </option>
                    ))}
                </select>
              </div>

              {/* Fare Breakdown Card */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>সিটের ভাড়া ({selectedSeats.length} টি আসন)</span>
                  <span className="font-semibold text-navy-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>অনলাইন সার্ভিস চার্জ</span>
                  <span className="font-semibold text-navy-900">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-navy-900 pt-2 border-t border-gray-100">
                  <span>সর্বমোট প্রদেয়</span>
                  <span className="text-[#FF6B0A] text-lg">{formatPrice(totalPayable)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || selectedSeats.length === 0}
                className="w-full py-3.5 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
              >
                <span>{language === 'bn' ? 'পেমেন্টে এগিয়ে যান' : 'Proceed to Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function TripDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading trip details...</div>}>
      <TripDetailContent />
    </Suspense>
  );
}
