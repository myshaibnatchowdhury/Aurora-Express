'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { Trip, BusType } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import {
  MapPin,
  Calendar,
  Clock,
  Bus,
  Filter,
  CheckCircle2,
  ArrowRight,
  Wifi,
  Coffee,
  BatteryCharging,
  SlidersHorizontal,
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, formatPrice, formatNumber } = useLanguage();

  const originParam = searchParams.get('from') || 'Dhaka';
  const destinationParam = searchParams.get('to') || 'Chittagong';
  const dateParam = searchParams.get('date') || '2026-10-29';
  const passengersParam = searchParams.get('passengers') || '1';

  const [fromCity, setFromCity] = useState(originParam);
  const [toCity, setToCity] = useState(destinationParam);
  const [travelDate, setTravelDate] = useState(dateParam);
  const [selectedBusType, setSelectedBusType] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(1500);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const results = db.searchTrips({
      origin: originParam,
      destination: destinationParam,
      date: dateParam,
      busType: selectedBusType === 'ALL' ? undefined : selectedBusType,
    });
    setTrips(results);
    setLoading(false);
  }, [originParam, destinationParam, dateParam, selectedBusType]);

  const handleFilterUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(
        toCity
      )}&date=${travelDate}`
    );
  };

  const filteredTrips = trips.filter((t) => t.baseFare <= maxPrice);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Top Search Modification Bar */}
      <div className="bg-[#071B33] text-white py-6 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleFilterUpdate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">
                {language === 'bn' ? 'যাত্রার স্থান' : 'From'}
              </label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-navy-800 border border-navy-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B0A]"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">
                {language === 'bn' ? 'গন্তব্য স্থান' : 'To'}
              </label>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-navy-800 border border-navy-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B0A]"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">
                {language === 'bn' ? 'যাত্রার তারিখ' : 'Date'}
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-navy-800 border border-navy-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B0A]"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF6B0A] hover:bg-[#E65A00] font-bold text-sm rounded-xl text-white transition-colors shadow-md"
              >
                {language === 'bn' ? 'ফিল্টার আপডেট' : 'Update Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF6B0A]" />
                  <span>{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBusType('ALL');
                    setMaxPrice(1500);
                  }}
                  className="text-[11px] text-[#FF6B0A] hover:underline"
                >
                  {language === 'bn' ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Bus Type Filter */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  {language === 'bn' ? 'বাসের ধরণ' : 'Bus Category'}
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'ALL', labelBn: 'সকল বাস', labelEn: 'All Buses' },
                    { id: 'AC_SLEEPER', labelBn: 'এসি স্লিপার (VIP)', labelEn: 'AC Sleeper (VIP)' },
                    { id: 'AC_BUSINESS', labelBn: 'এসি বিজনেস ক্লাস', labelEn: 'AC Business Class' },
                    { id: 'NON_AC', labelBn: 'নন-এসি ডিলাক্স', labelEn: 'Non-AC Deluxe' },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="busCategory"
                        checked={selectedBusType === item.id}
                        onChange={() => setSelectedBusType(item.id)}
                        className="text-[#FF6B0A] focus:ring-[#FF6B0A]"
                      />
                      <span className="text-gray-700">
                        {language === 'bn' ? item.labelBn : item.labelEn}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700">
                    {language === 'bn' ? 'সর্বোচ্চ ভাড়া' : 'Max Fare'}
                  </label>
                  <span className="text-xs font-bold text-[#FF6B0A]">
                    {formatPrice(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full accent-[#FF6B0A]"
                />
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <p className="text-xs sm:text-sm font-semibold text-gray-600">
                {language === 'bn' ? (
                  <>
                    <span className="text-[#FF6B0A] font-bold">{originParam}</span> হতে{' '}
                    <span className="text-[#FF6B0A] font-bold">{destinationParam}</span> অভিমুখে{' '}
                    <span className="font-bold text-navy-900">{filteredTrips.length}</span> টি ট্রিপ পাওয়া গেছে ({travelDate})
                  </>
                ) : (
                  <>
                    Showing <span className="font-bold text-navy-900">{filteredTrips.length}</span> available trips from{' '}
                    <span className="text-[#FF6B0A] font-bold">{originParam}</span> to{' '}
                    <span className="text-[#FF6B0A] font-bold">{destinationParam}</span> on {travelDate}
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <div className="py-16 text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-[#FF6B0A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-medium">ট্রিপ লোড হচ্ছে...</p>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
                <Bus className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-navy-900">
                  {language === 'bn' ? 'কোনো ট্রিপ খুঁজে পাওয়া যায়নি' : 'No Scheduled Trips Found'}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  {language === 'bn'
                    ? 'আপনার নির্বাচিত তারিখ বা ফিল্টারে কোনো বাস পাওয়া যায়নি। অনুগ্রহ করে তারিখ বা রুট পরিবর্তন করে পুনরায় চেষ্টা করুন।'
                    : 'We could not find active trips for the selected route or date. Try adjusting your filters or date.'}
                </p>
              </div>
            ) : (
              filteredTrips.map((trip) => {
                const totalSeats = trip.bus?.totalSeats || 36;
                // Calculate available seats by checking reservations
                const inventory = db.getTripSeatInventory(trip.id);
                const availableSeats = inventory.filter((s) => s.status === 'AVAILABLE').length;

                return (
                  <div
                    key={trip.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Coach & Timings */}
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-navy-900 text-white font-mono text-xs font-bold">
                            {trip.bus?.coachNumber}
                          </span>
                          <span className="text-sm font-bold text-navy-900">
                            {trip.bus?.model}
                          </span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6B0A] font-bold">
                            {trip.bus?.busType.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Times & Route */}
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-xl font-black text-navy-900">
                              {trip.departureTime}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              {trip.route?.origin} ({trip.route?.stops[0]?.stopName.split(' ')[0]})
                            </span>
                          </div>

                          <div className="flex flex-col items-center px-2">
                            <span className="text-[11px] text-gray-400 font-medium">
                              {trip.route?.estimatedDuration}
                            </span>
                            <div className="w-24 h-0.5 bg-gray-200 relative my-1">
                              <div className="w-2 h-2 rounded-full bg-[#FF6B0A] absolute left-0 -top-0.5" />
                              <div className="w-2 h-2 rounded-full bg-navy-900 absolute right-0 -top-0.5" />
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              Direct Highway
                            </span>
                          </div>

                          <div>
                            <span className="text-xl font-black text-navy-900">
                              {trip.arrivalTime}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              {trip.route?.destination}
                            </span>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-500">
                          {trip.bus?.amenities.slice(0, 4).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-0.5 rounded-md border border-gray-100"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{amenity}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Fare & Action Button */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0 gap-3">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                            ভাড়া (প্রতি আসন)
                          </span>
                          <span className="text-2xl font-black text-[#FF6B0A]">
                            {formatPrice(trip.baseFare)}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                            {availableSeats} টি আসন ফাঁকা আছে
                          </span>
                        </div>

                        <button
                          onClick={() => router.push(`/trips/${trip.id}`)}
                          className="px-5 py-2.5 bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                        >
                          <span>{language === 'bn' ? 'সিট দেখুন ও বুক করুন' : 'View Seats'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
