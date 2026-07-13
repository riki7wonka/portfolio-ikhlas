'use client';

import { useState, useEffect, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Store the prompt globally so it's never lost
let cachedPrompt: BeforeInstallPromptEvent | null = null;

// Detect iOS
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

// Detect standalone mode (already installed)
function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function PWAInstallButton() {
  const [promptReady, setPromptReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [visible, setVisible] = useState(false);
  const [debug, setDebug] = useState('');
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const ios = typeof window !== 'undefined' ? isIOS() : false;

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(() => setDebug(d => d + ' | SW:OK'))
        .catch(() => setDebug(d => d + ' | SW:FAIL'));
    }

    // Already installed?
    if (isStandalone()) {
      setInstalled(true);
      setDebug('standalone');
      return;
    }

    setDebug('UA:' + navigator.userAgent.slice(0, 40));

    // iOS: always show banner (no install API available on iOS)
    if (ios) {
      setTimeout(() => setVisible(true), 800);
      return;
    }

    // Android / Desktop: wait for beforeinstallprompt
    const capture = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      cachedPrompt = promptEvent;
      promptRef.current = promptEvent;
      setPromptReady(true);
      setVisible(true);
      setDebug(d => d + ' | PROMPT:READY');
    };

    // If prompt was already captured globally before this mount
    if (cachedPrompt) {
      promptRef.current = cachedPrompt;
      setPromptReady(true);
      setVisible(true);
      setDebug(d => d + ' | PROMPT:CACHED');
    }

    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setVisible(false);
      cachedPrompt = null;
    });

    // Show after 3s even if prompt hasn't fired — to show iOS-style guide as fallback
    const fallbackTimer = setTimeout(() => {
      if (!promptRef.current) {
        setVisible(true);
        setDebug(d => d + ' | FALLBACK');
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', capture);
      clearTimeout(fallbackTimer);
    };
  }, [ios]);

  const handleInstall = async () => {
    const prompt = promptRef.current || cachedPrompt;

    if (!prompt) {
      // No native prompt — show browser guide
      alert(
        ios
          ? 'على iPhone:\n١. اضغط زر المشاركة □↑\n٢. اختر "Add to Home Screen"\n٣. اضغط Add'
          : 'على Chrome Android:\n١. اضغط النقاط الثلاث ⋮\n٢. اختر "Add to Home screen"\n٣. اضغط Add\n\n⚠️ تأكد من استخدام Chrome'
      );
      return;
    }

    setIsInstalling(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setVisible(false);
        cachedPrompt = null;
        promptRef.current = null;
      }
    } catch (err) {
      console.error('Install failed:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  if (installed || !visible) return null;

  return (
    <>
      <style>{`
        .pwa-wrap {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 99999;
          font-family: var(--font-cairo), 'Cairo', Arial, sans-serif;
          direction: rtl;
        }

        .pwa-bar {
          background: linear-gradient(135deg, #12052a 0%, #1e0840 100%);
          border-top: 1.5px solid rgba(108,99,255,0.5);
          box-shadow: 0 -6px 32px rgba(108,99,255,0.3);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          animation: pwa-up 0.4s cubic-bezier(0.34,1.4,0.64,1) both;
        }

        .pwa-app-icon {
          width: 50px; height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg,#6c63ff,#a855f7);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(108,99,255,0.5);
        }

        .pwa-info { flex: 1; min-width: 0; }

        .pwa-title {
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          margin: 0 0 3px;
        }

        .pwa-sub {
          color: rgba(200,185,255,0.75);
          font-size: 12px;
          margin: 0;
        }

        .pwa-btn {
          padding: 11px 22px;
          background: linear-gradient(135deg,#6c63ff,#a855f7);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 18px rgba(108,99,255,0.5);
          transition: transform 0.15s, opacity 0.15s;
          display: flex; align-items: center; gap: 6px;
          flex-shrink: 0;
        }

        .pwa-btn:active  { transform: scale(0.95); opacity: 0.85; }
        .pwa-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .pwa-close {
          width: 28px; height: 28px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          color: rgba(255,255,255,0.45);
          font-size: 15px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .pwa-close:active { background: rgba(255,255,255,0.15); }

        .pwa-spin {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .pwa-ios-hint {
          background: rgba(108,99,255,0.1);
          border-top: 1px solid rgba(108,99,255,0.2);
          padding: 10px 18px;
          font-size: 12px;
          color: rgba(190,175,255,0.85);
          text-align: center;
        }

        .pwa-ios-hint strong { color: #c4b5fd; }

        @keyframes pwa-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="pwa-wrap">
        <div className="pwa-bar">
          <div className="pwa-app-icon">📚</div>

          <div className="pwa-info">
            <p className="pwa-title">تطبيق إخلاص</p>
            <p className="pwa-sub">
              {promptReady
                ? '✅ جاهز للتثبيت الآن!'
                : ios
                  ? 'أضفه إلى الشاشة الرئيسية'
                  : '⚠️ افتح بـ Chrome للتثبيت المباشر'}
            </p>
          </div>

          <button
            className="pwa-btn"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling
              ? <div className="pwa-spin" />
              : promptReady
                ? '⬇️ ثبّت'
                : ios
                  ? '📖 كيف؟'
                  : '⬇️ ثبّت'}
          </button>

          <button
            className="pwa-close"
            onClick={() => setVisible(false)}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {ios && (
          <div className="pwa-ios-hint">
            اضغط <strong>□↑ مشاركة</strong> ثم اختر <strong>"Add to Home Screen"</strong>
          </div>
        )}
      </div>
    </>
  );
}
