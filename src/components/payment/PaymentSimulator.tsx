'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';
import { ShieldCheck, AlertTriangle, CheckCircle, CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PaymentSimulatorProps {
  amount: number;
  bookingRef: string;
  initialGateway?: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH';
  onPaymentSuccess: (paymentDetails: {
    gateway: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH';
    transactionRef: string;
  }) => void;
  onCancel?: () => void;
}

export default function PaymentSimulator({
  amount,
  bookingRef,
  initialGateway,
  onPaymentSuccess,
  onCancel,
}: PaymentSimulatorProps) {
  const { language, formatPrice } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH'>(
    initialGateway || 'BKASH'
  );
  const [step, setStep] = useState<'SELECT' | 'DETAILS' | 'OTP' | 'PIN' | 'PROCESSING'>(
    initialGateway && initialGateway !== 'CASH' ? 'DETAILS' : 'SELECT'
  );
  const [mobileNumber, setMobileNumber] = useState('01817-987654');
  const [otp, setOtp] = useState('1234');
  const [pin, setPin] = useState('12345');
  const [isProcessing, setIsProcessing] = useState(false);

  const startPayment = (method: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'CASH') => {
    setSelectedMethod(method);
    if (method === 'CASH') {
      // Counter Cash instant approval
      processFinalPayment('CASH', `CASH-CNT-${Math.floor(100000 + Math.random() * 900000)}`);
    } else if (method === 'CARD') {
      setStep('DETAILS');
    } else {
      setStep('DETAILS');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === 'CARD') {
      setStep('PROCESSING');
      simulateCardProcessing();
    } else {
      setStep('OTP');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PIN');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PROCESSING');
    setIsProcessing(true);
    setTimeout(() => {
      const txnRef = `TRX-${selectedMethod}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setIsProcessing(false);
      onPaymentSuccess({ gateway: selectedMethod, transactionRef: txnRef });
    }, 1500);
  };

  const simulateCardProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txnRef = `CARD-AUTH-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setIsProcessing(false);
      onPaymentSuccess({ gateway: 'CARD', transactionRef: txnRef });
    }, 1500);
  };

  const processFinalPayment = (method: any, txn: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({ gateway: method, transactionRef: txn });
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-lg mx-auto">
      {/* Sandbox / Simulator Warning Banner */}
      <div className="bg-amber-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>PAYMENT SIMULATOR (SANDBOX / DEVELOPMENT MODE)</span>
        </div>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">TEST READY</span>
      </div>

      <div className="p-6">
        {/* Header & Payable Amount */}
        <div className="text-center pb-6 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            {language === 'bn' ? 'পরিশোধযোগ্য মোট টাকা' : 'Total Amount Payable'}
          </p>
          <p className="text-3xl font-black text-navy-900 mt-1">
            {formatPrice(amount)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            Booking Ref: {bookingRef}
          </p>
        </div>

        {/* Step: Select Payment Gateway */}
        {step === 'SELECT' && (
          <div className="mt-6 space-y-4">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* bKash */}
              <button
                type="button"
                onClick={() => startPayment('BKASH')}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-[#E2136E] hover:bg-pink-50/50 flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#E2136E] text-white flex items-center justify-center font-bold text-sm">
                  bK
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#E2136E]">
                  bKash
                </span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => startPayment('NAGAD')}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-[#F7941D] hover:bg-orange-50/50 flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#F7941D] text-white flex items-center justify-center font-bold text-sm">
                  না
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#F7941D]">
                  Nagad
                </span>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => startPayment('ROCKET')}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-[#8C3494] hover:bg-purple-50/50 flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#8C3494] text-white flex items-center justify-center font-bold text-sm">
                  DB
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#8C3494]">
                  Rocket
                </span>
              </button>

              {/* Debit/Credit Card */}
              <button
                type="button"
                onClick={() => startPayment('CARD')}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50/50 flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-blue-600">
                  Card (Visa/Master)
                </span>
              </button>
            </div>

            {/* Counter Cash Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => startPayment('CASH')}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-gray-300 hover:border-emerald-500 bg-gray-50 hover:bg-emerald-50 text-xs font-bold text-gray-700 hover:text-emerald-700 flex items-center justify-center gap-2 transition-all"
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'কাউন্টার ক্যাশ পেমেন্ট' : 'Pay Cash at Counter'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step: MFS Mobile Number */}
        {step === 'DETAILS' && selectedMethod !== 'CARD' && (
          <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 ${
                  selectedMethod === 'BKASH'
                    ? 'bg-[#E2136E]'
                    : selectedMethod === 'NAGAD'
                    ? 'bg-[#F7941D]'
                    : selectedMethod === 'ROCKET'
                    ? 'bg-[#8C3494]'
                    : 'bg-blue-600'
                }`}
              >
                {selectedMethod === 'BKASH' ? 'bK' : selectedMethod === 'NAGAD' ? 'না' : 'DB'}
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">
                  {selectedMethod === 'BKASH'
                    ? 'বিকাশ (bKash) একাউন্ট'
                    : selectedMethod === 'NAGAD'
                    ? 'নগদ (Nagad) একাউন্ট'
                    : selectedMethod === 'ROCKET'
                    ? 'রকেট (Rocket) একাউন্ট'
                    : `${selectedMethod} Account`}
                </p>
                <p className="text-[11px] text-gray-500">
                  {language === 'bn' ? 'আপনার মোবাইল ওয়ালেট নম্বর দিন' : 'Enter your mobile wallet number'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                placeholder="017XXXXXXXX"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('SELECT')}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                {language === 'bn' ? 'অন্যান্য মেথড' : 'Change Method'}
              </button>
              <button
                type="submit"
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                  selectedMethod === 'BKASH'
                    ? 'bg-[#E2136E] hover:bg-[#C20F5D]'
                    : selectedMethod === 'NAGAD'
                    ? 'bg-[#F7941D] hover:bg-[#D97D14]'
                    : selectedMethod === 'ROCKET'
                    ? 'bg-[#8C3494] hover:bg-[#722778]'
                    : 'bg-[#FF6B0A] hover:bg-[#E65A00]'
                }`}
              >
                {language === 'bn' ? 'পরবর্তী ধাপ (OTP)' : 'Proceed (OTP)'}
              </button>
            </div>
          </form>
        )}

        {/* Step: Card Details */}
        {step === 'DETAILS' && selectedMethod === 'CARD' && (
          <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                defaultValue="4242 •••• •••• 4242"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Expiry</label>
                <input
                  type="text"
                  defaultValue="12/28"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">CVV</label>
                <input
                  type="password"
                  defaultValue="888"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('SELECT')}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Pay {formatPrice(amount)}
              </button>
            </div>
          </form>
        )}

        {/* Step: MFS OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-xs font-bold text-navy-900">Verification Code (OTP)</p>
              <p className="text-[11px] text-gray-500 mt-1">
                A verification code was sent to {mobileNumber}. For testing, use simulated OTP:
              </p>
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-md font-mono font-bold text-xs text-navy-900 mt-2">
                1234
              </span>
            </div>

            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-widest font-mono text-lg font-bold py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white text-xs font-bold shadow-md"
              >
                Confirm OTP
              </button>
            </div>
          </form>
        )}

        {/* Step: MFS PIN */}
        {step === 'PIN' && (
          <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-xs font-bold text-navy-900">Enter {selectedMethod} PIN</p>
              <p className="text-[11px] text-gray-500 mt-1">
                Development simulator PIN (e.g. 12345)
              </p>
            </div>

            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={5}
                className="w-full text-center tracking-widest font-mono text-xl font-bold py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF6B0A] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF6B0A] hover:bg-[#E65A00] text-white text-sm font-bold shadow-md"
            >
              Confirm & Pay {formatPrice(amount)}
            </button>
          </form>
        )}

        {/* Processing State */}
        {step === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FF6B0A] border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <p className="text-sm font-bold text-navy-900">Verifying Payment...</p>
              <p className="text-xs text-gray-500 mt-1">
                Connecting to {selectedMethod} gateway simulator
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted</span>
        </span>
        <span>Aurora Express Secure Pay</span>
      </div>
    </div>
  );
}
