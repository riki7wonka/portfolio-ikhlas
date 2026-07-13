'use client';

import { useState, useEffect, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let cachedPrompt: BeforeInstallPromptEvent | null = null;

function getDeviceInfo() {
  if (typeof navigator === 'undefined') return { os: 'unknown', browser: 'unknown' };
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isChrome = /chrome|crios/i.test(ua) && !/edg/i.test(ua);
  const isSamsung = /samsungbrowser/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
  const os = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
  const browser = isChrome ? 'chrome' : isSamsung ? 'samsung' : isSafari ? 'safari' : 'other';
  return { os, browser };
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true);
}

export default function PWAInstallButton() {
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [promptReady, setPromptReady] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [info, setInfo] = useState({ os: 'unknown', browser: 'unknown' });
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Current page URL for Chrome deep-link
  const siteUrl = typeof window !== 'undefined' ? window.location.href : '';
  const chromeUrl = `googlechrome://navigate?url=${encodeURIComponent(siteUrl)}`;

  useEffect(() => {
    if (isStandalone()) { setInstalled(true); return; }

    const device = getDeviceInfo();
    setInfo(device);

    if (device.os === 'desktop') return; // Hide on desktop

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Capture install prompt (Chrome / Samsung Browser)
    const capture = (e: Event) => {
      e.preventDefault();
      const pe = e as BeforeInstallPromptEvent;
      cachedPrompt = pe;
      promptRef.current = pe;
      setPromptReady(true);
    };

    if (cachedPrompt) {
      promptRef.current = cachedPrompt;
      setPromptReady(true);
    }

    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', () => { setInstalled(true); setVisible(false); });

    // Show banner after 1s on any mobile
    setTimeout(() => setVisible(true), 1000);

    return () => window.removeEventListener('beforeinstallprompt', capture);
  }, []);

  const handleInstall = async () => {
    const prompt = promptRef.current || cachedPrompt;
    if (!prompt) return;
    setIsInstalling(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') { setInstalled(true); setVisible(false); cachedPrompt = null; }
    } finally { setIsInstalling(false); }
  };

  if (installed || !visible) return null;

  const { os, browser } = info;
  const canInstallDirect = (browser === 'chrome' || browser === 'samsung') && os === 'android';
  const isIOS = os === 'ios';
  const isOtherAndroid = os === 'android' && !canInstallDirect;

  return (
    <>
      <style>{`
        .pwa-wrap {
          position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 99999;
          font-family: var(--font-cairo),'Cairo',Arial,sans-serif;
          direction: rtl;
        }
        .pwa-bar {
          background: linear-gradient(160deg,#0d0420 0%,#1a0535 100%);
          border-top: 1.5px solid rgba(108,99,255,.45);
          box-shadow: 0 -8px 40px rgba(108,99,255,.3);
          padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          animation: pwa-up .4s cubic-bezier(.34,1.4,.64,1) both;
        }
        .pwa-ico {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg,#6c63ff,#a855f7);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(108,99,255,.5);
        }
        .pwa-text { flex: 1; min-width: 0; }
        .pwa-title { color:#fff; font-size:14px; font-weight:800; margin:0 0 3px; }
        .pwa-sub { color:rgba(200,185,255,.75); font-size:11px; margin:0; line-height:1.4; }
        .pwa-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .pwa-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg,#6c63ff,#a855f7);
          color: #fff; border: none; border-radius: 50px;
          font-family: inherit; font-size: 13px; font-weight: 700;
          cursor: pointer; white-space: nowrap; text-decoration: none;
          display: flex; align-items: center; gap: 5px;
          box-shadow: 0 4px 16px rgba(108,99,255,.45);
          transition: transform .15s, opacity .15s;
        }
        .pwa-btn:active { transform: scale(.95); opacity: .85; }
        .pwa-btn:disabled { opacity:.6; cursor:not-allowed; }
        .pwa-close {
          width:28px; height:28px; border-radius:50%;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
          color:rgba(255,255,255,.4); font-size:14px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
        }

        /* iOS steps bar */
        .pwa-ios-bar {
          background: rgba(108,99,255,.12);
          border-top: 1px solid rgba(108,99,255,.2);
          padding: 10px 16px;
          display: flex; align-items: center; justify-content: center;
          gap: 6px; font-size: 12px; color: rgba(200,185,255,.85);
          flex-wrap: wrap; text-align: center;
        }
        .pwa-ios-bar strong { color: #c4b5fd; }

        .pwa-spin {
          width:13px; height:13px;
          border:2px solid rgba(255,255,255,.3);
          border-top-color:#fff; border-radius:50%;
          animation: spin .7s linear infinite;
        }
        @keyframes pwa-up {
          from { transform:translateY(100%); opacity:0; }
          to   { transform:translateY(0);    opacity:1; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="pwa-wrap">
        <div className="pwa-bar">
          <div className="pwa-ico">📚</div>

          <div className="pwa-text">
            <p className="pwa-title">تطبيق إخلاص</p>
            <p className="pwa-sub">
              {canInstallDirect && promptReady && 'جاهز للتثبيت — اضغط الزر الآن!'}
              {canInstallDirect && !promptReady && 'انتظر لحظة...'}
              {isOtherAndroid && 'سيفتح في Chrome للتثبيت المباشر'}
              {isIOS && 'أضفه لشاشتك الرئيسية عبر Safari'}
            </p>
          </div>

          <div className="pwa-actions">
            {/* Android Chrome/Samsung — direct install */}
            {canInstallDirect && (
              <button
                className="pwa-btn"
                onClick={handleInstall}
                disabled={isInstalling || !promptReady}
              >
                {isInstalling
                  ? <div className="pwa-spin" />
                  : <>⬇️ ثبّت</>}
              </button>
            )}

            {/* Android other browser — open in Chrome */}
            {isOtherAndroid && (
              <a
                className="pwa-btn"
                href={chromeUrl}
                rel="noopener noreferrer"
              >
                🌐 افتح بـ Chrome
              </a>
            )}

            {/* iOS Safari — scroll to instructions below */}
            {isIOS && (
              <button
                className="pwa-btn"
                onClick={() => {
                  // iOS has no API, instructions shown below
                }}
                style={{ pointerEvents: 'none', opacity: 0.85 }}
              >
                👇 اتبع الخطوات
              </button>
            )}

            <button className="pwa-close" onClick={() => setVisible(false)} aria-label="إغلاق">✕</button>
          </div>
        </div>

        {/* iOS step-by-step always visible */}
        {isIOS && (
          <div className="pwa-ios-bar">
            <span>١. اضغط</span>
            <strong>□↑ مشاركة</strong>
            <span>٢. اختر</span>
            <strong>Add to Home Screen</strong>
            <span>٣. اضغط</span>
            <strong>Add ✓</strong>
          </div>
        )}
      </div>
    </>
  );
}
