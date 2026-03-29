'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-[13px] font-medium text-gray-700"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[160px] overflow-hidden">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] hover:bg-gray-50 transition-colors text-left ${
                language === lang.code ? 'bg-primary-50 text-primary-800 font-semibold' : 'text-gray-700'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
