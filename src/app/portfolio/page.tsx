import { getData } from '@/lib/data';
import { FileText, User, Calendar, CheckCircle, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'معرض الأعمال - إخلاص بوعلام',
  description: 'معرض تجاربي في التدقيق اللغوي ومراجعة النصوص والكتب الأكاديمية',
};

// Dynamic type colors based on index or hash, fallback for unknown categories
const getBadgeColor = (type: string) => {
  const colors = ['badge-blue', 'badge-purple', 'badge-green', 'badge-orange', 'badge-pink'];
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default async function PortfolioPage() {
  const { proofreadingWorks, siteOwner } = await getData();
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <section className="page-hero">
        <span className="section-tag anim-fade-up anim-delay-1">معرض الأعمال</span>
        <h1 className="anim-fade-up anim-delay-2">تجاربي في التدقيق اللغوي</h1>
        <p className="anim-fade-up anim-delay-3">
          مراجعة شاملة للنصوص والكتب والأبحاث العلمية بدقة واحترافية
        </p>
      </section>

      {/* Stats — editable from admin panel */}
      {(siteOwner.projectsCompleted || siteOwner.pagesProofread || siteOwner.yearsExperience || siteOwner.customerSatisfaction) && (
        <section className="container">
          <div className="portfolio-stats anim-fade-up anim-delay-2">
            {siteOwner.projectsCompleted && (
              <div className="glass-card stat-card">
                <span className="stat-number">{siteOwner.projectsCompleted}</span>
                <span className="stat-label">مشروع منجز</span>
              </div>
            )}
            {siteOwner.pagesProofread && (
              <div className="glass-card stat-card">
                <span className="stat-number">{siteOwner.pagesProofread}</span>
                <span className="stat-label">صفحة مدققة</span>
              </div>
            )}
            {siteOwner.yearsExperience && (
              <div className="glass-card stat-card">
                <span className="stat-number">{siteOwner.yearsExperience}</span>
                <span className="stat-label">سنوات الخبرة</span>
              </div>
            )}
            {siteOwner.customerSatisfaction && (
              <div className="glass-card stat-card">
                <span className="stat-number">{siteOwner.customerSatisfaction}</span>
                <span className="stat-label">رضا العملاء</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Works Grid */}
      <section className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
        <div className="works-grid">
          {proofreadingWorks.map((work, i) => (
            <article
              key={work.id}
              className={`glass-card work-card anim-fade-up anim-delay-${Math.min(i + 1, 5)}`}
            >
              <div className="work-card-top">
                <div className="work-icon-wrap">
                  {work.type === 'كتاب تعليمي' && <BookOpen size={24} strokeWidth={1.8} />}
                  {work.type === 'قصص أطفال' && <BookOpen size={24} strokeWidth={1.8} />}
                  {work.type === 'بحث علمي' && <FileText size={24} strokeWidth={1.8} />}
                  {work.type === 'محتوى رقمي' && <CheckCircle size={24} strokeWidth={1.8} />}
                </div>
                <div className="work-meta">
                  <span className={`badge ${getBadgeColor(work.type)}`}>{work.type}</span>
                  <span className="work-year">{work.year}</span>
                </div>
              </div>

              <h2 className="work-title">{work.title}</h2>

              <div className="work-client">
                <User size={14} strokeWidth={1.8} />
                <span>{work.client}</span>
              </div>

              <p className="work-description">{work.description}</p>

              <div className="work-footer">
                <div className="work-pages">
                  <Calendar size={14} strokeWidth={1.8} />
                  <span>{work.pages}</span>
                </div>
                {work.pdfUrl && (
                  <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.82rem', borderColor: 'var(--cyan-400)', color: 'var(--cyan-700)' }}>
                    <FileText size={14} />
                    عرض الملف
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .portfolio-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          padding: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--cyan-600), var(--cyan-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .works-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
        }

        .work-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .work-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .work-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(34,211,238,0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan-600);
        }

        .work-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .work-year {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .work-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .work-client {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--cyan-600);
          font-weight: 600;
        }

        .work-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.75;
          flex: 1;
        }

        .work-footer {
          padding-top: 0.75rem;
          border-top: 1px solid rgba(6,182,212,0.12);
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .work-pages {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .portfolio-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .works-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
