'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Store,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Ticket,
} from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, logout, availableProfiles, loginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [pnrSearch, setPnrSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const handlePnrLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrSearch.trim()) {
      router.push(`/my-bookings?pnr=${pnrSearch.trim().toUpperCase()}`);
      setSearchModalOpen(false);
      setPnrSearch('');
    }
  };

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/buses', label: t.nav.buses },
    { href: '/search', label: t.nav.routes },
    { href: '/about', label: t.nav.about },
    { href: '/help', label: t.nav.help },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#071B33] text-white shadow-md border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-44 sm:w-52">
              <Image
                src="/images/aurora-header-logo.png"
                alt="Aurora Express"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#FF6B0A] ${
                    isActive ? 'text-[#FF6B0A] border-b-2 border-[#FF6B0A] pb-1' : 'text-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Quick Search / PNR Lookup Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-navy-800 transition-colors"
              title="PNR Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* My Bookings Button */}
            <Link
              href="/my-bookings"
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full border border-gray-600 bg-navy-800/80 hover:bg-[#FF6B0A] hover:border-[#FF6B0A] text-white transition-all shadow-sm"
            >
              <Ticket className="w-4 h-4" />
              <span>{t.nav.myBookings}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-navy-800 text-gray-200 hover:text-white border border-gray-700 hover:border-gray-500 transition-all"
            >
              <span>{language === 'bn' ? 'বাংলা' : 'English'}</span>
              <span>{language === 'bn' ? '🇧🇩' : '🇺🇸'}</span>
            </button>

            {/* Quick Persona & Portals Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleModal(!showRoleModal)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#0D2B52] border border-blue-900/80 hover:border-[#FF6B0A] text-xs font-medium text-white transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF6B0A] flex items-center justify-center text-white font-bold text-[10px]">
                  {user?.fullName.charAt(0) || 'U'}
                </div>
                <span className="max-w-[110px] truncate">{user?.fullName.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showRoleModal && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-2 z-50 text-gray-800 border border-gray-200 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 font-medium">Current User / Role</p>
                    <p className="text-sm font-bold text-navy-900">{user?.fullName}</p>
                    <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-semibold uppercase tracking-wider rounded bg-orange-100 text-[#FF6B0A]">
                      {role?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="py-1">
                    <p className="px-4 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Quick Portals
                    </p>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowRoleModal(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B0A]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#FF6B0A]" />
                      <span>Company Dashboard (Tenant)</span>
                    </Link>
                    <Link
                      href="/counter"
                      onClick={() => setShowRoleModal(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B0A]"
                    >
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Counter POS (Gabtoli)</span>
                    </Link>
                    <Link
                      href="/agent"
                      onClick={() => setShowRoleModal(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B0A]"
                    >
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <span>Agent & Reseller Portal</span>
                    </Link>
                    <Link
                      href="/boarding"
                      onClick={() => setShowRoleModal(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B0A]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Boarding QR Verification</span>
                    </Link>
                    <Link
                      href="/platform"
                      onClick={() => setShowRoleModal(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B0A]"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Super Admin (SaaS Platform)</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <p className="px-4 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Switch Test Persona
                    </p>
                    {availableProfiles.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          loginAs(p.id);
                          setShowRoleModal(false);
                        }}
                        className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-gray-100 ${
                          user?.id === p.id ? 'font-bold text-[#FF6B0A]' : 'text-gray-600'
                        }`}
                      >
                        <span className="truncate">{p.fullName}</span>
                        <span className="text-[10px] text-gray-400 uppercase">{p.role.split('_')[0]}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleModal(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1 text-xs rounded bg-navy-800 text-white font-medium"
            >
              {language === 'bn' ? 'বাং' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#071B33] border-b border-navy-800 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-gray-200 hover:text-[#FF6B0A]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-navy-800 flex flex-col gap-2">
              <Link
                href="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-white font-medium hover:text-[#FF6B0A]"
              >
                <Ticket className="w-4 h-4 text-[#FF6B0A]" />
                <span>{t.nav.myBookings}</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-300 hover:text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Company Dashboard</span>
              </Link>
              <Link
                href="/counter"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-300 hover:text-white"
              >
                <Store className="w-4 h-4" />
                <span>Counter POS</span>
              </Link>
              <Link
                href="/platform"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-300 hover:text-white"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Super Admin</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* PNR Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-navy-900 mb-2">টিকিট ও PNR অনুসন্ধান</h3>
            <p className="text-xs text-gray-500 mb-4">
              আপনার টিকিট যাচাই বা ডাউনলোড করতে ৬ সংখ্যার PNR কোড লিখুন (যেমন: AE-784912)
            </p>
            <form onSubmit={handlePnrLookup} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="AE-XXXXXX"
                  value={pnrSearch}
                  onChange={(e) => setPnrSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B0A] font-mono text-sm uppercase"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF6B0A] hover:bg-[#E65A00] text-white font-semibold rounded-lg text-sm transition-colors shadow-md"
              >
                খুঁজুন
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
