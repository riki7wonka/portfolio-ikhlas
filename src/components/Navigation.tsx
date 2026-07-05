'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Briefcase,
  BookOpen,
  FileText,
  Mail,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/portfolio', label: 'أعمالي', icon: Briefcase },
  { href: '/blog', label: 'مقالات ودروس', icon: BookOpen },
  { href: '/tests', label: 'الاختبارات', icon: FileText },
  { href: '/contact', label: 'تواصلي', icon: Mail },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`desktop-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <span className="logo-text">إخلاص</span>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} className={`nav-link ${active ? 'nav-link--active' : ''}`}>
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {active && <div className="nav-indicator" />}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/admin" className="nav-admin-link">
          <Settings size={16} strokeWidth={1.8} />
          <span>لوحة التحكم</span>
        </Link>
      </nav>

      {/* Mobile Top Bar */}
      <header className="mobile-header">
        <span className="logo-text">إخلاص</span>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="قائمة التنقل"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <ul>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={`mobile-nav-link ${active ? 'mobile-nav-link--active' : ''}`}>
                      <Icon size={20} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href="/admin" className="mobile-nav-link mobile-nav-admin">
                  <Settings size={20} strokeWidth={1.8} />
                  <span>لوحة التحكم</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`mobile-bottom-link ${active ? 'mobile-bottom-link--active' : ''}`}>
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
