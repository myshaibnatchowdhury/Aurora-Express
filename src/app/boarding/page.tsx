'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  QrCode,
  Search,
  CheckCircle2,
  Users,
  Bus,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function BoardingPage() {
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();
  const [tokenInput, setTokenInput] = useState('');
  const [activeTripId, setActiveTripId] = useState(db.trips[0]?.id || '');
  const [scanMessage, setScanMessage] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null);

  const selectedTrip = db.trips.find((t) => t.id === activeTripId);
  const tripBookings = db.bookings.filter((b) => b.tripId === activeTripId);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScanMessage(null);

    const res = db.verifyTicket(tokenInput.trim());
    if (res.verified && res.booking) {
      setScanMessage({
        type: 'SUCCESS',
        text: `যাত্রী ${res.booking.passengerName} (আসন: ${res.booking.seatNumbers.join(', ')}) সফলভাবে বোর্ড করেছেন!`,
      });
      setTokenInput('');
    } else {
      setScanMessage({
        type: 'ERROR',
        text: res.message || 'টিকিট ভেরিফিকেশন ব্যর্থ হয়েছে।',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#071B33] text-white py-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                LIVE TERMINAL GATE
              </span>
            </div>
            <h1 className="text-2xl font-black">
              {language === 'bn' ? 'বোর্ডিং ও প্যাসেঞ্জার ভেরিফিকেশন' : 'Boarding & Gate Scanner'}
            </h1>
            <p className="text-xs text-gray-400">
              কাউন্টার / টার্মিনাল বোর্ডিং অফিসার: <strong>{user?.fullName}</strong>
            </p>
          </div>

          {/* Quick Trip Selector */}
          <div className="bg-navy-800 p-2 rounded-2xl border border-navy-700">
            <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1 px-1">
              ডিপার্চার বাস ট্রিপ
            </label>
            <select
              value={activeTripId}
              onChange={(e) => setActiveTripId(e.target.value)}
              className="bg-navy-900 border border-navy-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#FF6B0A]"
            >
              {db.trips.slice(0, 5).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.bus?.coachNumber} ({t.departureTime}) - {t.route?.origin} ➔ {t.route?.destination}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8">
        {/* Gate Scanner Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-navy-900 mb-2 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#FF6B0A]" />
            <span>গেট স্ক্যানার / PNR ভেরিফাই</span>
          </h2>
          <form onSubmit={handleVerifySubmit} className="flex gap-3">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="QR কোড টোকেন স্ক্যান করুন অথবা PNR লিখুন (যেমন: AE-784912)..."
              className="flex-grow px-4 py-3 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ভেরিফাই ও বোর্ড করুন</span>
            </button>
          </form>

          {scanMessage && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                scanMessage.type === 'SUCCESS'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {scanMessage.type === 'SUCCESS' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{scanMessage.text}</span>
            </div>
          )}
        </div>

        {/* Departure Manifest Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-900">
                যাত্রী তালিকা (Manifest) - {selectedTrip?.bus?.coachNumber}
              </h3>
              <p className="text-xs text-gray-500">
                {selectedTrip?.route?.origin} ➔ {selectedTrip?.route?.destination} ({selectedTrip?.departureDate} at {selectedTrip?.departureTime})
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-[#FF6B0A]">
              মোট বুকিং: {tripBookings.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">PNR</th>
                  <th className="px-6 py-3">যাত্রীর নাম</th>
                  <th className="px-6 py-3">মোবাইল</th>
                  <th className="px-6 py-3">আসন নম্বর</th>
                  <th className="px-6 py-3">বোর্ডিং পয়েন্ট</th>
                  <th className="px-6 py-3">ভাড়া</th>
                  <th className="px-6 py-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {tripBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      এই ট্রিপে এখনও কোনো বুকিং সম্পন্ন হয়নি।
                    </td>
                  </tr>
                ) : (
                  tripBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-mono font-bold text-navy-900">{b.pnr}</td>
                      <td className="px-6 py-3 font-bold text-navy-900">{b.passengerName}</td>
                      <td className="px-6 py-3 font-mono">{b.passengerPhone}</td>
                      <td className="px-6 py-3 font-mono font-bold text-[#FF6B0A]">
                        {b.seatNumbers.join(', ')}
                      </td>
                      <td className="px-6 py-3">{b.boardingPoint}</td>
                      <td className="px-6 py-3 font-bold">{formatPrice(b.totalAmount)}</td>
                      <td className="px-6 py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
