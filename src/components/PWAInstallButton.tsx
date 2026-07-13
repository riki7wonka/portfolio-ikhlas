'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowButton(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    setIsInstalling(true);
    
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowButton(false);
      }
    } finally {
      setIsInstalling(false);
      setInstallPrompt(null);
    }
  };

  if (!showButton || isInstalled) return null;

  return (
    <>
      <style>{`
        .pwa-install-btn {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #6c63ff 0%, #a855f7 50%, #ec4899 100%);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-family: var(--font-cairo), sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 0 30px rgba(108, 99, 255, 0.5),
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          animation: pwa-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     pwa-glow-pulse 2s ease-in-out infinite;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        .pwa-install-btn:hover {
          transform: translateX(-50%) translateY(-3px) scale(1.03);
          box-shadow:
            0 0 50px rgba(108, 99, 255, 0.7),
            0 16px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }

        .pwa-install-btn:active {
          transform: translateX(-50%) translateY(-1px) scale(0.98);
        }

        .pwa-install-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .pwa-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .pwa-install-btn:hover .pwa-icon {
          transform: translateY(-2px);
        }

        .pwa-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: pwa-spin 0.8s linear infinite;
        }

        @keyframes pwa-slide-up {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes pwa-glow-pulse {
          0%, 100% {
            box-shadow:
              0 0 30px rgba(108, 99, 255, 0.5),
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255,255,255,0.2);
          }
          50% {
            box-shadow:
              0 0 50px rgba(168, 85, 247, 0.7),
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255,255,255,0.2);
          }
        }

        @keyframes pwa-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .pwa-install-btn {
            bottom: 16px;
            padding: 12px 22px;
            font-size: 14px;
            max-width: calc(100vw - 32px);
          }
        }
      `}</style>

      <button
        className="pwa-install-btn"
        onClick={handleInstall}
        disabled={isInstalling}
        title="تثبيت التطبيق على جهازك"
      >
        <div className="pwa-icon">
          {isInstalling ? (
            <div className="pwa-spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
        </div>
        {isInstalling ? 'جارٍ التثبيت...' : '📲 تثبيت التطبيق'}
      </button>
    </>
  );
}
