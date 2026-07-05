'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Globe, Link2 } from 'lucide-react';

export default function ContactPage() {
  const [siteOwner, setSiteOwner] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setSiteOwner(data.siteOwner || {});
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    // Simulate sending
    setSent(true);
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <section className="page-hero">
        <span className="section-tag anim-fade-up anim-delay-1">تواصل معي</span>
        <h1 className="anim-fade-up anim-delay-2">أنا هنا لمساعدتك</h1>
        <p className="anim-fade-up anim-delay-3">
          سواء كنت تحتاج لتدقيق نصوصك أو لديك أسئلة، لا تتردد في التواصل
        </p>
      </section>

      <div className="container contact-container">
        {/* Contact Info */}
        <div className="contact-info anim-fade-up anim-delay-2">
          <div className="glass-card info-card">
            <h2 className="info-title">معلومات التواصل</h2>
            {loading ? <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>جاري التحميل...</p> : (
            <>
            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="info-label">البريد الإلكتروني</p>
                  <p className="info-value">{siteOwner.email}</p>
                </div>
              </div>

              {siteOwner.phone && (
                <div className="info-item">
                  <div className="info-icon">
                    <Phone size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="info-label">رقم الهاتف</p>
                    <p className="info-value">{siteOwner.phone}</p>
                  </div>
                </div>
              )}

              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="info-label">الموقع</p>
                  <p className="info-value">{siteOwner.location}</p>
                </div>
              </div>
            </div>

            {(siteOwner.instagram || siteOwner.linkedin) && (
              <div className="social-links">
                {siteOwner.instagram && (
                  <a
                    href={siteOwner.instagram}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="contact-instagram"
                    aria-label="Instagram"
                  >
                    <Globe size={20} strokeWidth={1.8} />
                  </a>
                )}
                {siteOwner.linkedin && (
                  <a
                    href={siteOwner.linkedin}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="contact-linkedin"
                    aria-label="LinkedIn"
                  >
                    <Link2 size={20} strokeWidth={1.8} />
                  </a>
                )}
              </div>
            )}

            <div className="availability-badge">
              <div className="availability-dot" />
              <span>متاحة لمشاريع جديدة</span>
            </div>
            </>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrap anim-fade-up anim-delay-3">
          {!sent ? (
            <form className="glass-card contact-form" onSubmit={handleSubmit} noValidate>
              <h2 className="form-title">أرسل لي رسالة</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">الاسم الكامل *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="اسمك الكامل"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">البريد الإلكتروني *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">موضوع الرسالة</label>
                <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}>
                  <option value="">اختر الموضوع</option>
                  <option value="proofreading">طلب تدقيق لغوي</option>
                  <option value="lesson">طلب درس خاص</option>
                  <option value="test">طلب اختبار مخصص</option>
                  <option value="collab">طلب تعاون</option>
                  <option value="other">موضوع آخر</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">الرسالة *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="اكتب رسالتك هنا..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  style={{ minHeight: '140px' }}
                />
              </div>

              {error && (
                <p className="form-error">{error}</p>
              )}

              <button type="submit" className="btn btn-primary" id="send-message-btn" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={16} />
                إرسال الرسالة
              </button>
            </form>
          ) : (
            <div className="glass-card sent-card">
              <div className="sent-icon">
                <CheckCircle size={48} strokeWidth={1.5} />
              </div>
              <h2>تم إرسال رسالتك!</h2>
              <p>شكراً لك، سأرد عليك في أقرب وقت ممكن إن شاء الله.</p>
              <button
                id="send-another-btn"
                className="btn btn-outline"
                onClick={() => {
                  setSent(false);
                  setForm({ name: '', email: '', subject: '', message: '' });
                }}
              >
                إرسال رسالة أخرى
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 2rem;
          padding-bottom: 6rem;
        }

        .info-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 6rem;
        }

        .info-title, .form-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .info-items {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .info-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(34,211,238,0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan-600);
          flex-shrink: 0;
        }

        .info-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 0.15rem;
        }

        .info-value {
          font-size: 0.92rem;
          color: var(--text-body);
          font-weight: 500;
          word-break: break-all;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          border: 1.5px solid rgba(6,182,212,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan-600);
          transition: all 0.2s;
        }

        .social-link:hover {
          background: rgba(6,182,212,0.1);
          border-color: var(--cyan-400);
        }

        .availability-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 100px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #065f46;
        }

        .availability-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse-glow 2s infinite;
        }

        .contact-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .contact-form .form-title {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-error {
          color: #dc2626;
          font-size: 0.88rem;
          font-weight: 500;
          background: rgba(239,68,68,0.08);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(239,68,68,0.2);
          margin-bottom: 0.5rem;
        }

        .sent-card {
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .sent-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cyan-500), var(--cyan-400));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(6,182,212,0.4);
        }

        .sent-card h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sent-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .contact-container {
            grid-template-columns: 1fr;
          }

          .info-card {
            position: static;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
