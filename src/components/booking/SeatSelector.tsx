'use client';

import React, { useState, useEffect } from 'react';
import { Trip, SeatInventoryItem } from '@/lib/types';
import { db } from '@/lib/db';
import { useLanguage } from '@/lib/i18n';
import { Armchair, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

interface SeatSelectorProps {
  trip: Trip;
  sessionId: string;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  maxSeats?: number;
}

export default function SeatSelector({
  trip,
  sessionId,
  selectedSeats,
  onSeatSelect,
  maxSeats = 4,
}: SeatSelectorProps) {
  const { language, formatPrice } = useLanguage();
  const [inventory, setInventory] = useState<SeatInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  // Load seats from server / db
  const refreshSeats = () => {
    try {
      const seats = db.getTripSeatInventory(trip.id, sessionId);
      setInventory(seats);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading seats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSeats();
    // Auto-refresh seats periodically to reflect live availability
    const interval = setInterval(refreshSeats, 8000);
    return () => clearInterval(interval);
  }, [trip.id, sessionId]);

  // Handle seat click
  const handleSeatClick = (seat: SeatInventoryItem) => {
    setErrorMessage(null);

    // If already booked or blocked, do nothing
    if (seat.status === 'BOOKED' || seat.status === 'BLOCKED') {
      return;
    }

    // If held by someone else, do nothing
    if (seat.status === 'HELD') {
      setErrorMessage(
        language === 'bn'
          ? `সিট ${seat.seatNumber} অন্য একজন যাত্রী বুকিং প্রক্রিয়ায় রেখেছেন।`
          : `Seat ${seat.seatNumber} is temporarily held by another passenger.`
      );
      return;
    }

    const isCurrentlySelected = selectedSeats.includes(seat.seatNumber);

    if (isCurrentlySelected) {
      // Deselect and release hold
      const updated = selectedSeats.filter((s) => s !== seat.seatNumber);
      db.releaseSeats(trip.id, [seat.seatNumber], sessionId);
      onSeatSelect(updated);
      refreshSeats();
    } else {
      // Select new seat
      if (selectedSeats.length >= maxSeats) {
        setErrorMessage(
          language === 'bn'
            ? `একবারে সর্বোচ্চ ${maxSeats}টি সিট নির্বাচন করা যাবে।`
            : `You can select a maximum of ${maxSeats} seats at a time.`
        );
        return;
      }

      // Request hold from DB
      const result = db.holdSeats(trip.id, [...selectedSeats, seat.seatNumber], sessionId);
      if (!result.success) {
        setErrorMessage(result.message);
        refreshSeats();
        return;
      }

      const updated = [...selectedSeats, seat.seatNumber];
      onSeatSelect(updated);
      refreshSeats();
    }
  };

  const isVipLayout = trip.bus?.seatingLayout === '2x1_VIP';

  // Group seats by row
  const rowsMap: { [row: number]: SeatInventoryItem[] } = {};
  inventory.forEach((item) => {
    if (!rowsMap[item.rowNumber]) rowsMap[item.rowNumber] = [];
    rowsMap[item.rowNumber].push(item);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-navy-900">
            {language === 'bn' ? 'আসন নির্বাচন করুন' : 'Select Seats'}
          </h3>
          <p className="text-xs text-gray-500">
            {trip.bus?.coachNumber} • {trip.bus?.model} ({trip.bus?.busType.replace('_', ' ')})
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 block">
            {language === 'bn' ? 'ভাড়া (প্রতি আসন)' : 'Fare (per seat)'}
          </span>
          <span className="text-base font-black text-[#FF6B0A]">
            {formatPrice(trip.baseFare)}
          </span>
        </div>
      </div>

      {/* Error alert if hold failed */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Seat Map Layout */}
      <div className="mt-6 flex flex-col items-center">
        {/* Bus Cabin Boundary */}
        <div className="w-full max-w-sm rounded-3xl border-2 border-gray-200 bg-gray-50/70 p-4 shadow-inner relative">
          {/* Driver Cockpit & Entrance */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-gray-300">
            {/* Entrance Door */}
            <div className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {language === 'bn' ? 'দরজা' : 'Door'}
            </div>
            {/* Steering Wheel / Driver Icon */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>{language === 'bn' ? 'ড্রাইভার' : 'Driver'}</span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3">
            {Object.keys(rowsMap).map((rowKey) => {
              const rowNum = parseInt(rowKey, 10);
              const rowSeats = rowsMap[rowNum];

              if (isVipLayout) {
                // 2 + 1 VIP Layout: Col 1 & 2 on left, Col 3 on right
                const leftSeats = rowSeats.filter((s) => s.colNumber <= 2);
                const rightSeat = rowSeats.find((s) => s.colNumber === 3);

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-2">
                    {/* Left 2 seats */}
                    <div className="flex gap-2">
                      {leftSeats.map((s) => (
                        <SeatButton
                          key={s.seatNumber}
                          seat={s}
                          isSelected={selectedSeats.includes(s.seatNumber)}
                          onClick={() => handleSeatClick(s)}
                        />
                      ))}
                    </div>

                    {/* Aisle */}
                    <div className="w-8 flex items-center justify-center text-[10px] text-gray-300 font-mono">
                      {rowNum}
                    </div>

                    {/* Right 1 VIP seat */}
                    <div>
                      {rightSeat && (
                        <SeatButton
                          seat={rightSeat}
                          isSelected={selectedSeats.includes(rightSeat.seatNumber)}
                          onClick={() => handleSeatClick(rightSeat)}
                        />
                      )}
                    </div>
                  </div>
                );
              } else {
                // 2 + 2 Layout: Col 1 & 2 on left, Col 3 & 4 on right
                const leftSeats = rowSeats.filter((s) => s.colNumber <= 2);
                const rightSeats = rowSeats.filter((s) => s.colNumber > 2);

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-2">
                    {/* Left 2 seats */}
                    <div className="flex gap-2">
                      {leftSeats.map((s) => (
                        <SeatButton
                          key={s.seatNumber}
                          seat={s}
                          isSelected={selectedSeats.includes(s.seatNumber)}
                          onClick={() => handleSeatClick(s)}
                        />
                      ))}
                    </div>

                    {/* Aisle */}
                    <div className="w-8 flex items-center justify-center text-[10px] text-gray-300 font-mono">
                      {rowNum}
                    </div>

                    {/* Right 2 seats */}
                    <div className="flex gap-2">
                      {rightSeats.map((s) => (
                        <SeatButton
                          key={s.seatNumber}
                          seat={s}
                          isSelected={selectedSeats.includes(s.seatNumber)}
                          onClick={() => handleSeatClick(s)}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-white border-2 border-gray-300" />
            <span className="text-gray-600">{language === 'bn' ? 'ফাঁকা' : 'Available'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#FF6B0A] border-2 border-[#FF6B0A]" />
            <span className="text-gray-900 font-semibold">{language === 'bn' ? 'নির্বাচিত' : 'Selected'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-amber-400 border-2 border-amber-500" />
            <span className="text-gray-600">{language === 'bn' ? 'হোল্ড করা' : 'Held (Hold)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gray-300 border-2 border-gray-400" />
            <span className="text-gray-400">{language === 'bn' ? 'বুক করা' : 'Booked'}</span>
          </div>
        </div>
      </div>

      {/* Selected Summary Footer */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div>
            <p className="text-xs text-orange-900 font-semibold">
              {language === 'bn' ? 'নির্বাচিত আসনসমূহ:' : 'Selected Seats:'}{' '}
              <span className="font-mono font-bold text-[#FF6B0A]">{selectedSeats.join(', ')}</span>
            </p>
            <p className="text-[11px] text-orange-700 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? 'সিটগুলো ১০ মিনিটের জন্য সুরক্ষিত রাখা হয়েছে'
                  : 'Seats are safely locked for 10 minutes'}
              </span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">
              {language === 'bn' ? 'মোট ভাড়া' : 'Total Payable'}
            </span>
            <span className="text-lg font-black text-[#FF6B0A]">
              {formatPrice(trip.baseFare * selectedSeats.length)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function SeatButton({
  seat,
  isSelected,
  onClick,
}: {
  seat: SeatInventoryItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  let btnStyle = 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#FF6B0A] hover:text-[#FF6B0A]';

  if (isSelected) {
    btnStyle = 'bg-[#FF6B0A] border-2 border-[#FF6B0A] text-white shadow-md scale-105';
  } else if (seat.status === 'BOOKED') {
    btnStyle = 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed';
  } else if (seat.status === 'HELD') {
    btnStyle = 'bg-amber-100 border-2 border-amber-400 text-amber-700 cursor-not-allowed';
  } else if (seat.status === 'BLOCKED') {
    btnStyle = 'bg-red-100 border-2 border-red-300 text-red-500 cursor-not-allowed';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={seat.status === 'BOOKED' || (seat.status === 'HELD' && !isSelected)}
      className={`w-10 h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${btnStyle}`}
      title={`Seat ${seat.seatNumber} (${seat.status})`}
    >
      <Armchair className="w-4 h-4 stroke-[2]" />
      <span className="text-[10px] leading-none mt-0.5">{seat.seatNumber}</span>
    </button>
  );
}
