'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import OfflineBadge from './OfflineBadge';
import LanguageSelector from './LanguageSelector';
import { Menu, Bell, Search } from 'lucide-react';

// Lazy load heavy components
const AiChatbot = dynamic(() => import('./AiChatbot'), { ssr: false });

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function AppLayout({ children, pageTitle, pageSubtitle }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          isOnline={true}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileSidebarOpen(false)}
              isOnline={true}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
        `}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shadow-sm">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          <div className="flex-1">
            {pageTitle && (
              <div>
                <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">{pageTitle}</h1>
                {pageSubtitle && (
                  <p className="text-[11px] text-gray-400 leading-tight">{pageSubtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-52">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent text-[13px] text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* Language selector */}
          <LanguageSelector />

          {/* Notifications */}
          <button className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-danger rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-300 transition-all">
            <span className="text-[11px] font-bold text-primary-800">AM</span>
          </div>
        </header>

        {/* Vendor warning banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-2">
          <span className="text-[11px] text-amber-700 font-medium">
            ⚠️ Bor-Bi est un outil de gestion. Les transactions réelles se font hors application.
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 max-w-screen-2xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            © 2026 TransTech Solution — Bor-Bi
          </span>
          <div className="flex items-center gap-4">
            <a href="/terms.html" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">CGU</a>
            <a href="/privacy.html" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Confidentialité</a>
            <a href="/legal.html" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Mentions légales</a>
          </div>
        </footer>
      </div>

      {/* AI Chatbot floating button - lazy loaded */}
      <AiChatbot />
      {/* Offline badge */}
      <OfflineBadge />
    </div>
  );
}