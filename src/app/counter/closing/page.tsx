'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  BookOpen,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export default function CounterClosingPage() {
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();

  const activeShift = db.shifts[0];
  const [actualCash, setActualCash] = useState<number>(activeShift?.expectedClosingCash || 23750);
  const [notes, setNotes] = useState('All transactions balanced.');
  const [isClosed, setIsClosed] = useState(activeShift?.status === 'CLOSED');

  const expected = activeShift ? activeShift.openingCash + activeShift.cashSalesTotal : 23750;
  const variance = actualCash - expected;

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeShift) {
      activeShift.status = 'CLOSED';
      activeShift.actualClosingCash = actualCash;
      activeShift.variance = variance;
      activeShift.closedAt = new Date().toISOString();
      activeShift.closedByUserId = user?.id;
      activeShift.notes = notes;

      // Add financial ledger entry for drawer closing
      db.ledger.push({
        id: `ledg-shift-${Date.now()}`,
        tenantId: user?.tenantId || 'tenant-aurora-01',
        counterId: activeShift.counterId,
        date: new Date().toISOString(),
        entryType: 'CASH_DRAWER',
        amount: actualCash,
        flow: 'CREDIT',
        description: `Shift closed by ${user?.fullName} (Variance: ${variance})`,
        referenceId: activeShift.id,
      });

      setIsClosed(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <div className="bg-[#071B33] text-white py-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
            DAILY SHIFT CASHBOOK RECONCILIATION
          </span>
          <h1 className="text-2xl font-black">
            কাউন্টার শিফট ক্লোজিং ও ক্যাশবুক হিসাব
          </h1>
          <p className="text-xs text-gray-400">
            কাউন্টার: <strong>{activeShift?.counterName}</strong> • শিফট আইডি: {activeShift?.id}
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
          {isClosed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-navy-900">
                শিফট সফলভাবে ক্লোজ করা হয়েছে
              </h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                ক্লোজিং ক্যাশ ব্যালেন্স কেন্দ্রীয় অ্যাকাউন্টিং লেজারে সংরক্ষিত হয়েছে।
              </p>
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>ক্লোজিং সামারি প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCloseShift} className="space-y-6">
              {/* Financial Balance Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">ওপেনিং ক্যাশ ফ্লট</span>
                  <p className="text-lg font-black text-navy-900 mt-1">
                    {formatPrice(activeShift?.openingCash || 5000)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">আজকের ক্যাশ বিক্রি</span>
                  <p className="text-lg font-black text-emerald-600 mt-1">
                    {formatPrice(activeShift?.cashSalesTotal || 18750)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-orange-700 font-bold uppercase block">প্রত্যাশিত মোট ক্যাশ</span>
                  <p className="text-lg font-black text-[#FF6B0A] mt-1">
                    {formatPrice(expected)}
                  </p>
                </div>
              </div>

              {/* Physical Cash Count Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ড্রয়ারের প্রকৃত গণনা করা ক্যাশ (Actual Cash in Drawer) *
                </label>
                <input
                  type="number"
                  value={actualCash}
                  onChange={(e) => setActualCash(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-lg font-black focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                  required
                />
              </div>

              {/* Variance Display */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  variance === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : variance > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold block uppercase tracking-wider">
                    ক্যাশ ভ্যারিয়েন্স (Variance)
                  </span>
                  <span className="text-xs">
                    {variance === 0
                      ? '✓ কোনো অমিল নেই (Exact Match)'
                      : variance > 0
                      ? `+ ক্যাশ উদ্বৃত্ত (Surplus)`
                      : `- ক্যাশ ঘাটতি (Shortage)`}
                  </span>
                </div>
                <span className="text-xl font-black font-mono">
                  {formatPrice(Math.abs(variance))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ক্লোজিং মন্তব্য / নোট
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                শিফট হিসাব চূড়ান্ত ও ক্যাশবুক লক করুন
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
