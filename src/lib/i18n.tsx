'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en';

export interface Translations {
  appName: string;
  tagline: string;
  safeJourneyMotto: string;
  nav: {
    home: string;
    buses: string;
    routes: string;
    about: string;
    help: string;
    myBookings: string;
    login: string;
    logout: string;
    dashboard: string;
    counterPOS: string;
    agentPortal: string;
    superAdmin: string;
  };
  search: {
    from: string;
    to: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    date: string;
    passengers: string;
    person: string;
    searchBtn: string;
    swap: string;
  };
  hero: {
    badges: string;
    mainTitle: string;
    subTitle: string;
    description: string;
    ctaButton: string;
  };
  features: {
    safeTravel: string;
    safeTravelDesc: string;
    comfortableSeats: string;
    comfortableSeatsDesc: string;
    punctuality: string;
    punctualityDesc: string;
    onlineTicket: string;
    onlineTicketDesc: string;
    support: string;
    supportDesc: string;
  };
  popularRoutes: {
    title: string;
    viewAll: string;
    startingFrom: string;
    bookNow: string;
    duration: string;
  };
  promo: {
    title: string;
    subtitle: string;
    button: string;
    statBuses: string;
    statRoutes: string;
    statCounters: string;
    statPassengers: string;
    confidence: string;
  };
  footer: {
    rightsReserved: string;
    privacy: string;
    terms: string;
    refundPolicy: string;
    contactUs: string;
    hotline: string;
  };
}

export const translations: Record<Language, Translations> = {
  bn: {
    appName: 'অরোরা এক্সপ্রেস',
    tagline: 'দেশের পথে, আপনার সাথে...',
    safeJourneyMotto: 'নিরাপদ যাত্রা • সময়মত পৌঁছানো • আপনার আস্থায়',
    nav: {
      home: 'হোম',
      buses: 'বাসের তালিকা',
      routes: 'রুটসমূহ',
      about: 'আমাদের সম্পর্কে',
      help: 'সহায়তা',
      myBookings: 'আমার বুকিং',
      login: 'লগইন',
      logout: 'লগআউট',
      dashboard: 'কোম্পানি ড্যাশবোর্ড',
      counterPOS: 'কাউন্টার পিওএস',
      agentPortal: 'এজেন্ট পোর্টাল',
      superAdmin: 'সুপার অ্যাডমিন',
    },
    search: {
      from: 'যাত্রার স্থান',
      to: 'গন্তব্য স্থান',
      fromPlaceholder: 'ঢাকা',
      toPlaceholder: 'চট্টগ্রাম',
      date: 'যাত্রার তারিখ',
      passengers: 'যাত্রী সংখ্যা',
      person: '১ জন',
      searchBtn: 'খুঁজুন',
      swap: 'রুট পরিবর্তন',
    },
    hero: {
      badges: 'নিরাপদ যাত্রা • সময়মত পৌঁছানো • আপনার আস্থায়',
      mainTitle: 'অরোরা এক্সপ্রেস',
      subTitle: 'দেশের পথে, আপনার সাথে...',
      description: 'সাশ্রয়ী ভাড়া, আরামদায়ক যাত্রা এবং নির্ভরযোগ্য সার্ভিসের জন্য অরোরা এক্সপ্রেস সবসময় আপনার পাশে।',
      ctaButton: 'টিকিট খুঁজুন',
    },
    features: {
      safeTravel: 'নিরাপদ ভ্রমণ',
      safeTravelDesc: 'আপনার নিরাপত্তাই আমাদের অগ্রাধিকার',
      comfortableSeats: 'আরামদায়ক সিট',
      comfortableSeatsDesc: 'প্রশস্ত ও আরামদায়ক আসন',
      punctuality: ' hisসময়ানুবর্তিতা',
      punctualityDesc: 'নির্ধারিত সময়ে পৌঁছানো',
      onlineTicket: 'অনলাইন টিকিট',
      onlineTicketDesc: 'সহজে বুকিং, দ্রুত নিশ্চিতকরণ',
      support: '২৪/৭ সহায়তা',
      supportDesc: 'যেকোনো প্রয়োজনে পাশে আছি',
    },
    popularRoutes: {
      title: 'জনপ্রিয় রুটসমূহ',
      viewAll: 'সকল রুট দেখুন',
      startingFrom: 'থেকে',
      bookNow: 'বুক করুন',
      duration: 'আনুমানিক সময়',
    },
    promo: {
      title: 'এখনই বুক করুন',
      subtitle: 'আপনার পরবর্তী যাত্রা হোক আরও সহজ ও আরামদায়ক',
      button: 'বুকিং করুন',
      statBuses: '৫০+ বাস',
      statRoutes: '১৫+ রুট',
      statCounters: '১০০+ কাউন্টার',
      statPassengers: '৫০,০০০+ সন্তুষ্ট যাত্রী',
      confidence: 'Travel With Confidence',
    },
    footer: {
      rightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
      privacy: 'প্রাইভেসি পলিসি',
      terms: 'শর্তাবলী',
      refundPolicy: 'রিফান্ড ও বাতিল নীতি',
      contactUs: 'যোগাযোগ',
      hotline: 'হটলাইন: ১৬২৬৩ / ০৯৬১২-৩৩৪৫৫৬',
    },
  },
  en: {
    appName: 'AURORA EXPRESS',
    tagline: 'On the road of Bangladesh, with you...',
    safeJourneyMotto: 'Safe Journey • On-Time Arrival • In Your Trust',
    nav: {
      home: 'Home',
      buses: 'Bus Fleet',
      routes: 'Routes',
      about: 'About Us',
      help: 'Support',
      myBookings: 'My Bookings',
      login: 'Login',
      logout: 'Logout',
      dashboard: 'Company Dashboard',
      counterPOS: 'Counter POS',
      agentPortal: 'Agent Portal',
      superAdmin: 'Super Admin',
    },
    search: {
      from: 'From',
      to: 'To',
      fromPlaceholder: 'Dhaka',
      toPlaceholder: 'Chittagong',
      date: 'Journey Date',
      passengers: 'Passengers',
      person: '1 Person',
      searchBtn: 'Search',
      swap: 'Swap Route',
    },
    hero: {
      badges: 'Safe Journey • On-Time Arrival • In Your Trust',
      mainTitle: 'AURORA EXPRESS',
      subTitle: 'On the road of Bangladesh, with you...',
      description: 'Affordable fares, luxurious comfort, and reliable service. Aurora Express is always by your side.',
      ctaButton: 'Find Tickets',
    },
    features: {
      safeTravel: 'Safe Travel',
      safeTravelDesc: 'Your safety is our top priority',
      comfortableSeats: 'Comfortable Seats',
      comfortableSeatsDesc: 'Spacious and ergonomic recliner seats',
      punctuality: 'Punctuality',
      punctualityDesc: 'Guaranteed on-time departures and arrivals',
      onlineTicket: 'Online Tickets',
      onlineTicketDesc: 'Instant booking with digital QR e-tickets',
      support: '24/7 Support',
      supportDesc: 'Dedicated support team for any journey assistance',
    },
    popularRoutes: {
      title: 'Popular Routes',
      viewAll: 'View All Routes',
      startingFrom: 'From',
      bookNow: 'Book Now',
      duration: 'Est. Duration',
    },
    promo: {
      title: 'Book Your Journey Today',
      subtitle: 'Make your upcoming intercity travel seamless and comfortable',
      button: 'Book Now',
      statBuses: '50+ Buses',
      statRoutes: '15+ Routes',
      statCounters: '100+ Counters',
      statPassengers: '50,000+ Happy Riders',
      confidence: 'Travel With Confidence',
    },
    footer: {
      rightsReserved: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refundPolicy: 'Refund & Cancellation Policy',
      contactUs: 'Contact Us',
      hotline: 'Hotline: 16263 / 09612-334556',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatNumber: (n: number | string) => string;
  formatPrice: (n: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('aurora_lang') as Language;
    if (saved === 'bn' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aurora_lang', lang);
  };

  const formatNumber = (num: number | string): string => {
    const str = String(num);
    if (language === 'en') return str;
    return str.replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
  };

  const formatPrice = (amount: number): string => {
    if (language === 'en') {
      return `৳ ${amount.toLocaleString('en-US')}`;
    }
    return `৳ ${formatNumber(amount.toLocaleString('en-US'))}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        formatNumber,
        formatPrice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
