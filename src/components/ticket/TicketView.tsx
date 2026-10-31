'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Booking } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Bus,
} from 'lucide-react';

interface TicketViewProps {
  booking: Booking;
}

export default function TicketView({ booking }: TicketViewProps) {
  const { language, formatPrice, formatNumber } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate QR code pointing to ticket verification URL
    const verifyUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/verify-ticket/${booking.verificationToken}`
      : `https://auroraexpress.com/verify-ticket/${booking.verificationToken}`;

    QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#071B33',
        light: '#FFFFFF',
      },
    }).then(setQrDataUrl);
  }, [booking.verificationToken]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Action Buttons (Hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-navy-900">
            {language === 'bn' ? 'টিকিট সফলভাবে ইস্যু করা হয়েছে' : 'Ticket Issued Successfully'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রিন্ট করুন' : 'Print Ticket'}</span>
          </button>
        </div>
      </div>

      {/* Main Printable Ticket Card */}
      <div
        ref={ticketRef}
        className="bg-white rounded-3xl border-2 border-navy-900 shadow-2xl overflow-hidden print:shadow-none print:border-gray-800"
      >
        {/* Ticket Header */}
        <div className="bg-[#071B33] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-[#FF6B0A]">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative h-12 w-44">
              <Image
                src="/images/aurora-header-logo.png"
                alt="Aurora Express"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-[10px] font-semibold tracking-wider text-orange-400 uppercase block">
              Passenger Name Record (PNR)
            </span>
            <span className="text-2xl font-black font-mono tracking-widest text-white">
              {booking.pnr}
            </span>
          </div>
        </div>

        {/* Journey Details Bar */}
        <div className="bg-orange-50/70 px-6 py-4 border-b border-orange-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy-900 text-sm">
              {booking.trip?.route?.origin}
            </span>
            <span className="text-[#FF6B0A] font-bold text-base">➔</span>
            <span className="font-bold text-navy-900 text-sm">
              {booking.trip?.route?.destination}
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-700">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FF6B0A]" />
              <span className="font-semibold">{booking.trip?.departureDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#FF6B0A]" />
              <span className="font-semibold">{booking.trip?.departureTime}</span>
            </div>
          </div>
        </div>

        {/* Ticket Body Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="md:col-span-8 space-y-6">
            {/* Passenger Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 uppercase font-semibold block text-[10px]">
                  {language === 'bn' ? 'যাত্রীর নাম' : 'Passenger Name'}
                </span>
                <p className="font-bold text-navy-900 text-sm mt-0.5">{booking.passengerName}</p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-semibold block text-[10px]">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </span>
                <p className="font-bold text-navy-900 text-sm mt-0.5">{booking.passengerPhone}</p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-semibold block text-[10px]">
                  {language === 'bn' ? 'বোর্ডিং পয়েন্ট' : 'Boarding Point'}
                </span>
                <p className="font-bold text-navy-900 text-sm mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B0A]" />
                  <span>{booking.boardingPoint}</span>
                </p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-semibold block text-[10px]">
                  {language === 'bn' ? 'ড্রপিং পয়েন্ট' : 'Dropping Point'}
                </span>
                <p className="font-bold text-navy-900 text-sm mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{booking.droppingPoint}</span>
                </p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-semibold block text-[10px]">
                  {language === 'bn' ? 'কোচ ও বাস টাইপ' : 'Coach & Bus Model'}
                </span>
                <p className="font-bold text-navy-900 text-sm mt-0.5">
                  {booking.trip?.bus?.coachNumber} ({booking.trip?.bus?.model})
                </p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-semibold block text-[10px]">
                  {language === 'bn' ? 'বুকিং মেথড ও স্ট্যাটাস' : 'Payment Status'}
                </span>
                <p className="font-bold text-emerald-600 text-sm mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{booking.paymentStatus} ({booking.paymentMethod})</span>
                </p>
              </div>
            </div>

            {/* Allocated Seats Box */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">
                  {language === 'bn' ? 'বরাদ্দকৃত আসনসমূহ' : 'Confirmed Seats'}
                </span>
                <div className="flex gap-2 mt-1">
                  {booking.seatNumbers.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 bg-[#071B33] text-white font-mono font-bold text-sm rounded-lg shadow-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">
                  {language === 'bn' ? 'পরিশোধিত মোট ভাড়া' : 'Total Fare Paid'}
                </span>
                <span className="text-xl font-black text-[#FF6B0A]">
                  {formatPrice(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Right QR Code Verification */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-gray-300 pt-6 md:pt-0 md:pl-6 text-center">
            <div className="p-2 bg-white rounded-2xl border-2 border-navy-900 shadow-md">
              {qrDataUrl ? (
                <Image
                  src={qrDataUrl}
                  alt="QR Ticket Verification"
                  width={140}
                  height={140}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 animate-pulse rounded-lg" />
              )}
            </div>

            <p className="text-[11px] font-bold text-navy-900 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official QR Verified</span>
            </p>
            <p className="text-[9px] text-gray-400 font-mono mt-0.5 break-all max-w-[160px]">
              {booking.verificationToken}
            </p>
            <p className="text-[10px] text-gray-500 mt-2">
              যাত্রার পূর্বে কাউন্টারে বা বাসে এই QR কোডটি প্রদর্শন করুন।
            </p>
          </div>
        </div>

        {/* Ticket Footer / Instructions */}
        <div className="bg-gray-100 px-6 py-4 text-[10px] text-gray-500 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>* যাত্রার নির্ধারিত সময়ের ৩০ মিনিট পূর্বে বোর্ডিং পয়েন্টে উপস্থিত থাকুন।</span>
          <span>হটলাইন: ১৬২৬৩ | support@auroraexpress.com</span>
        </div>
      </div>
    </div>
  );
}
