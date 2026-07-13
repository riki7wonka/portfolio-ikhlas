'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type DeviceType = 'android' | 'ios' | 'desktop' | 'unknown';

function detectDevice(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/mobile|tablet/.test(ua)) return 'unknown';
  return 'desktop';
}

function isRunningStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [device, setDevice] = useState<DeviceType>('unknown');
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Already installed as PWA?
    if (isRunningStandalone()) {
      setIsInstalled(true);
      return;
    }

    // Was banner dismissed this session?
    if (sessionStorage.getItem('pwa-dismissed') === '1') {
      setDismissed(true);
      return;
    }

    const type = detectDevice();
    setDevice(type);

    // Always show banner on mobile after short delay
    if (type === 'ios' || type === 'android' || type === 'unknown') {
      setTimeout(() => setShowBanner(true), 1500);
    }

    // Capture Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (device === 'ios') {
      setShowIOSModal(true);
      return;
    }

    if (installPrompt) {
      // Android with native prompt available
      setIsInstalling(true);
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
        }
      } finally {
        setIsInstalling(false);
        setInstallPrompt(null);
      }
    } else {
      // Android but no prompt yet — show manual guide
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-dismissed', '1');
    setDismissed(true);
    setShowBanner(false);
  };

  if (isInstalled || dismissed) return null;
  if (!showBanner) return null;

  const isAndroidNative = device === 'android' && !!installPrompt;

  return (
    <>
      <style>{`
        /* ===== BANNER ===== */
        .pwa-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 99999;
          background: linear-gradient(135deg, rgba(17,5,40,0.97) 0%, rgba(30,10,60,0.97) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(108,99,255,0.4);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 -8px 40px rgba(108,99,255,0.25);
          animation: pwa-banner-up 0.45s cubic-bezier(0.34,1.4,0.64,1) both;
          font-family: var(--font-cairo), 'Cairo', sans-serif;
        }

        .pwa-banner-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(108,99,255,0.5);
        }

        .pwa-banner-text {
          flex: 1;
          color: #fff;
          min-width: 0;
        }

        .pwa-banner-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 2px;
          white-space: nowrap;
        }

        .pwa-banner-subtitle {
          font-size: 12px;
          color: rgba(200,185,255,0.8);
          margin: 0;
        }

        .pwa-banner-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .pwa-install-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #6c63ff 0%, #a855f7 100%);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-family: var(--font-cairo), 'Cairo', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(108,99,255,0.4);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .pwa-install-btn:active {
          transform: scale(0.96);
        }

        .pwa-install-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pwa-dismiss-btn {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          color: rgba(255,255,255,0.5);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .pwa-dismiss-btn:active {
          background: rgba(255,255,255,0.15);
        }

        .pwa-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: pwa-spin 0.8s linear infinite;
        }

        /* ===== iOS MODAL ===== */
        .pwa-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: pwa-fade-in 0.25s ease both;
          font-family: var(--font-cairo), 'Cairo', sans-serif;
        }

        .pwa-modal {
          background: linear-gradient(160deg, #1a0a35 0%, #110520 100%);
          border: 1px solid rgba(108,99,255,0.3);
          border-radius: 24px 24px 0 0;
          padding: 28px 24px 40px;
          width: 100%;
          max-width: 480px;
          animation: pwa-modal-up 0.4s cubic-bezier(0.34,1.4,0.64,1) both;
          color: #fff;
          text-align: right;
        }

        .pwa-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .pwa-modal-title {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pwa-modal-close {
          width: 34px;
          height: 34px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pwa-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 20px;
          direction: rtl;
        }

        .pwa-step-num {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(108,99,255,0.4);
        }

        .pwa-step-content {
          flex: 1;
          padding-top: 6px;
        }

        .pwa-step-title {
          font-size: 14px;
          font-weight: 700;
          color: #e2d9ff;
          margin: 0 0 4px;
        }

        .pwa-step-desc {
          font-size: 13px;
          color: rgba(180,165,220,0.8);
          margin: 0;
          line-height: 1.5;
        }

        .pwa-step-icon {
          font-size: 22px;
        }

        .pwa-modal-note {
          margin-top: 20px;
          padding: 12px 16px;
          background: rgba(108,99,255,0.1);
          border: 1px solid rgba(108,99,255,0.2);
          border-radius: 12px;
          font-size: 12px;
          color: rgba(180,165,220,0.9);
          line-height: 1.6;
        }

        /* ===== ANIMATIONS ===== */
        @keyframes pwa-banner-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        @keyframes pwa-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes pwa-modal-up {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        @keyframes pwa-spin {
          to { transform: rotate(360deg); }
        }

        @media (min-width: 768px) {
          .pwa-banner { display: none; }
        }
      `}</style>

      {/* ===== BOTTOM BANNER ===== */}
      <div className="pwa-banner" role="banner">
        <div className="pwa-banner-icon">📲</div>
        <div className="pwa-banner-text">
          <p className="pwa-banner-title">ثبّت تطبيق إخلاص</p>
          <p className="pwa-banner-subtitle">
            {device === 'ios' ? 'أضفه إلى الشاشة الرئيسية' : 'تثبيت مجاني على هاتفك'}
          </p>
        </div>
        <div className="pwa-banner-actions">
          <button
            className="pwa-install-btn"
            onClick={handleInstallClick}
            disabled={isInstalling}
            aria-label="تثبيت التطبيق"
          >
            {isInstalling ? (
              <div className="pwa-spinner" />
            ) : (
              <>
                {device === 'ios' ? '📖 كيف؟' : '⬇️ تثبيت'}
              </>
            )}
          </button>
          <button
            className="pwa-dismiss-btn"
            onClick={handleDismiss}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ===== iOS / MANUAL GUIDE MODAL ===== */}
      {showIOSModal && (
        <div
          className="pwa-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowIOSModal(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="دليل التثبيت"
        >
          <div className="pwa-modal">
            <div className="pwa-modal-header">
              <div className="pwa-modal-title">كيف تثبّت التطبيق؟</div>
              <button
                className="pwa-modal-close"
                onClick={() => setShowIOSModal(false)}
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            {device === 'ios' ? (
              <>
                <div className="pwa-step">
                  <div className="pwa-step-num">١</div>
                  <div className="pwa-step-content">
                    <p className="pwa-step-title">اضغط على زر المشاركة</p>
                    <p className="pwa-step-desc">
                      اضغط على أيقونة <span className="pwa-step-icon">□↑</span> في أسفل Safari
                    </p>
                  </div>
                </div>
                <div className="pwa-step">
                  <div className="pwa-step-num">٢</div>
                  <div className="pwa-step-content">
                    <p className="pwa-step-title">اختر "إضافة إلى الشاشة الرئيسية"</p>
                    <p className="pwa-step-desc">
                      مرر للأسفل في قائمة المشاركة واضغط على <strong>"Add to Home Screen"</strong>
                    </p>
                  </div>
                </div>
                <div className="pwa-step">
                  <div className="pwa-step-num">٣</div>
                  <div className="pwa-step-content">
                    <p className="pwa-step-title">اضغط "إضافة"</p>
                    <p className="pwa-step-desc">
                      سيظهر التطبيق على شاشتك الرئيسية فوراً <span className="pwa-step-icon">🎉</span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="pwa-step">
                  <div className="pwa-step-num">١</div>
                  <div className="pwa-step-content">
                    <p className="pwa-step-title">اضغط على قائمة المتصفح</p>
                    <p className="pwa-step-desc">اضغط على النقاط الثلاث <strong>⋮</strong> في أعلى يمين Chrome</p>
                  </div>
                </div>
                <div className="pwa-step">
                  <div className="pwa-step-num">٢</div>
                  <div className="pwa-step-content">
                    <p className="pwa-step-title">اختر "إضافة إلى الشاشة الرئيسية"</p>
                    <p className="pwa-step-desc">ابحث عن خيار <strong>"Add to Home screen"</strong> أو <strong>"Install app"</strong></p>
                  </div>
                </div>
                <div className="pwa-step">
                  <div className="pwa-step-num">٣</div>
                  <div className="pwa-step-content">
                    <p className="pwa-step-title">اضغط "تثبيت"</p>
                    <p className="pwa-step-desc">سيظهر التطبيق على شاشتك الرئيسية <span className="pwa-step-icon">🎉</span></p>
                  </div>
                </div>
              </>
            )}

            <div className="pwa-modal-note">
              💡 التثبيت مجاني تماماً ولا يحتاج App Store أو Google Play — يعمل مباشرة من المتصفح
            </div>
          </div>
        </div>
      )}
    </>
  );
}
