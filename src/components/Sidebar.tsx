'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, ShoppingCart, Package, Users, Truck, MessageSquare, LogOut, ChevronLeft, ChevronRight, Wifi, WifiOff, ShieldCheck, BarChart2, BookOpen } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const vendorNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/new-sale', label: 'Nouvelle Vente', icon: <ShoppingCart size={20} /> },
  { href: '/stock-management', label: 'Stock', icon: <Package size={20} />, badge: 3 },
  { href: '/clients', label: 'Clients', icon: <Users size={20} /> },
  { href: '/orders', label: 'Commandes Grossistes', icon: <Truck size={20} />, badge: 2 },
  { href: '/messages', label: 'Messages', icon: <MessageSquare size={20} />, badge: 5 },
];

const wholesalerNavItems: NavItem[] = [
  { href: '/wholesaler/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/wholesaler/catalogue', label: 'Mon Catalogue', icon: <BookOpen size={20} /> },
  { href: '/orders', label: 'Commandes', icon: <Truck size={20} />, badge: 2 },
  { href: '/messages', label: 'Messages', icon: <MessageSquare size={20} />, badge: 5 },
];

const adminNavItems: NavItem[] = [
  { href: '/admin-portal', label: 'Portail Admin', icon: <ShieldCheck size={20} /> },
  { href: '/admin-portal?tab=dashboard', label: 'Dashboard', icon: <BarChart2 size={20} /> },
  { href: '/admin-portal?tab=users', label: 'Utilisateurs', icon: <Users size={20} /> },
  { href: '/admin-portal?tab=vitrine', label: 'Vitrine', icon: <Package size={20} /> },
  { href: '/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isOnline?: boolean;
  userRole?: 'VENDOR' | 'WHOLESALER' | 'ADMIN' | null;
  userName?: string;
  userInitials?: string;
}

export default function Sidebar({ collapsed, onToggle, isOnline = true, userRole, userName, userInitials }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [role, setRole] = useState<'VENDOR' | 'WHOLESALER' | 'ADMIN' | null>(userRole || null);
  const [displayName, setDisplayName] = useState(userName || 'Utilisateur');
  const [initials, setInitials] = useState(userInitials || 'U');

  useEffect(() => {
    if (!userRole) {
      // Try to get session info
      fetch('/api/auth/me')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setRole(data.role);
            if (data.email) {
              const parts = data.email.split('@')[0].split('.');
              const name = parts.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
              setDisplayName(name);
              setInitials(parts.map((p: string) => p.charAt(0).toUpperCase()).join('').slice(0, 2));
            }
          }
        })
        .catch(() => {});
    }
  }, [userRole]);

  const navItems = role === 'ADMIN' ? adminNavItems : role === 'WHOLESALER' ? wholesalerNavItems : vendorNavItems;

  const roleLabel = role === 'ADMIN' ? 'Administrateur' : role === 'WHOLESALER' ? 'Grossiste' : 'Vendeur';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-100 shadow-sidebar z-30
        flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-gray-100 px-3 ${collapsed ? 'justify-center' : 'gap-2'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[15px] text-primary-800 leading-tight tracking-tight truncate">
              Bor-Bi
            </span>
            <span className="text-[10px] text-gray-400 leading-tight truncate">TransTech Solution</span>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && role && (
        <div className="px-4 pt-3 pb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            role === 'ADMIN' ? 'bg-red-100 text-red-700' :
            role === 'WHOLESALER'? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}>
            {roleLabel}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Navigation
          </p>
        )}
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href.split('?')[0] + '/') || (item.href.includes('?') && pathname === item.href.split('?')[0]);
            return (
              <li key={`nav-${item.href}`}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium
                    transition-all duration-150 group relative
                    ${isActive
                      ? 'bg-primary-800 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <span className={`
                      ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                      ${isActive ? 'bg-white/20 text-white' : 'bg-danger text-white'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && item.badge > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
                  )}
                  {collapsed && (
                    <span className="
                      absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded
                      opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap
                      transition-opacity duration-150 z-50
                    ">
                      {item.label}
                      {item.badge ? ` (${item.badge})` : ''}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 p-2 space-y-1">
        {/* Online indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
          {isOnline
            ? <Wifi size={14} className="text-success flex-shrink-0" />
            : <WifiOff size={14} className="text-warning flex-shrink-0" />
          }
          {!collapsed && (
            <span className={`text-[11px] font-medium ${isOnline ? 'text-success' : 'text-warning'}`}>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          )}
        </div>

        {/* User profile */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              role === 'ADMIN' ? 'bg-red-100' : role === 'WHOLESALER' ? 'bg-blue-100' : 'bg-primary-100'
            }`}>
              <span className={`text-[11px] font-bold ${
                role === 'ADMIN' ? 'text-red-800' : role === 'WHOLESALER' ? 'text-blue-800' : 'text-primary-800'
              }`}>{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-gray-800 truncate">{displayName}</p>
              <p className="text-[10px] text-gray-400 truncate">{roleLabel}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
            text-danger hover:bg-red-50 transition-all duration-150 group
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>{loggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>}
          {collapsed && (
            <span className="
              absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded
              opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap
              transition-opacity duration-150 z-50
            ">
              Déconnexion
            </span>
          )}
        </button>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-600 transition-colors"
          title={collapsed ? 'Développer' : 'Réduire'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}