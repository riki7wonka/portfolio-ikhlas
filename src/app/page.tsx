import Link from 'next/link';
import { getData } from '@/lib/data';
import {
  GraduationCap,
  CheckCircle,
  BookOpen,
  FileText,
  Mail,
  ArrowLeft,
  Star,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { siteOwner } = await getData();
  return {
    title: `الرئيسية - ${siteOwner.firstName} ${siteOwner.lastName}`,
    description: siteOwner.bio,
  };
}

const iconMap: Record<string, React.ReactNode> = {
  'تعليم اللغة العربية': <GraduationCap size={22} strokeWidth={1.8} />,
  'التدقيق اللغوي': <CheckCircle size={22} strokeWidth={1.8} />,
  'تصميم الدروس': <BookOpen size={22} strokeWidth={1.8} />,
  'الكتابة الأدبية': <Star size={22} strokeWidth={1.8} />,
  'إنشاء الاختبارات': <FileText size={22} strokeWidth={1.8} />,
  'البحث التربوي': <Sparkles size={22} strokeWidth={1.8} />,
};

export default async function HomePage() {
  const { siteOwner, skills, articles, proofreadingWorks } = await getData();
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ===== HERO SECTION ===== */}
      <section className="home-hero">
        <div className="hero-inner container">
          <div className="hero-avatar-wrap anim-fade-up anim-delay-1">
            <div className="hero-avatar">
              {siteOwner.photo ? (
                <img
                  src={siteOwner.photo}
                  alt={`${siteOwner.firstName} ${siteOwner.lastName}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <span className="hero-avatar-letter">إ</span>
              )}
            </div>
            <div className="hero-avatar-ring" />
          </div>

          <div className="hero-text anim-fade-up anim-delay-2">
            <p className="hero-greeting">مرحباً، أنا</p>
            <h1 className="hero-name">
              {siteOwner.firstName} <span className="hero-name-accent">{siteOwner.lastName}</span>
            </h1>
            <p className="hero-title">{siteOwner.title}</p>
            <p className="hero-subtitle">{siteOwner.subtitle}</p>
            <p className="hero-bio">{siteOwner.bio}</p>

            <div className="hero-cta anim-fade-up anim-delay-3">
              <Link href="/portfolio" className="btn btn-primary" id="hero-portfolio-btn">
                معرض أعمالي
                <ArrowLeft size={16} />
              </Link>
              <Link href="/contact" className="btn btn-outline" id="hero-contact-btn">
                تواصلي معي
              </Link>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
      </section>

      {/* ===== SKILLS SECTION ===== */}
      <section className="home-section">
        <div className="container">
          <div className="section-header anim-fade-up">
            <span className="section-tag">ما أتقنه</span>
            <h2 className="section-title">مهاراتي وتخصصاتي</h2>
            <p className="section-desc">مجالات عملي وما أقدمه لطلابي وعملائي</p>
          </div>

          <div className="skills-grid">
            {skills.map((skill, i) => (
              <div
                key={skill.title}
                className={`glass-card skill-card anim-fade-up anim-delay-${Math.min(i + 1, 5)}`}
              >
                <div className="skill-icon">
                  {iconMap[skill.title] ?? <Star size={22} strokeWidth={1.8} />}
                </div>
                <h3 className="skill-title">{skill.title}</h3>
                <p className="skill-desc">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT ARTICLES ===== */}
      <section className="home-section home-section--alt">
        <div className="container">
          <div className="section-header anim-fade-up">
            <span className="section-tag">أحدث المحتوى</span>
            <h2 className="section-title">مقالات ودروس</h2>
            <p className="section-desc">أشارككم تجربتي ومعرفتي في تعليم اللغة العربية</p>
          </div>

          <div className="articles-preview">
            {articles.slice(0, 2).map((article, i) => (
              <div key={article.id} className={`glass-card article-preview-card anim-fade-up anim-delay-${i + 1}`}>
                <span className="badge">{article.category}</span>
                <h3 className="article-preview-title">{article.title}</h3>
                <p className="article-preview-summary">{article.summary}</p>
                <div className="article-meta">
                  <span className="article-date">{article.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/blog" className="btn btn-outline" id="home-blog-link">
              <BookOpen size={16} />
              مشاهدة جميع المقالات
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROOFREADING HIGHLIGHT ===== */}
      <section className="home-section">
        <div className="container">
          <div className="section-header anim-fade-up">
            <span className="section-tag">تجربتي</span>
            <h2 className="section-title">التدقيق اللغوي</h2>
            <p className="section-desc">أعمال في مراجعة النصوص والكتب والأبحاث العلمية</p>
          </div>

          <div className="proofreading-preview grid-2">
            {proofreadingWorks.slice(0, 2).map((work, i) => (
              <div key={work.id} className={`glass-card proof-card anim-fade-up anim-delay-${i + 1}`}>
                <div className="proof-header">
                  <span className="badge">{work.type}</span>
                  <span className="proof-year">{work.year}</span>
                </div>
                <h3 className="proof-title">{work.title}</h3>
                <p className="proof-client">{work.client}</p>
                <p className="proof-desc">{work.description}</p>
                <div className="proof-stat">
                  <FileText size={14} />
                  <span>{work.pages}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/portfolio" className="btn btn-primary" id="home-portfolio-link">
              <ArrowLeft size={16} />
              معرض الأعمال كاملاً
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-card glass-card">
            <div className="home-cta-icon">
              <Mail size={32} strokeWidth={1.5} />
            </div>
            <h2>هل تحتاج لمساعدة في تدقيق نصوصك؟</h2>
            <p>أنا هنا لمساعدتك في مراجعة نصوصك وكتاباتك بدقة واحترافية عالية</p>
            <Link href="/contact" className="btn btn-primary" id="cta-contact-btn">
              تواصل الآن
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        /* HERO */
        .home-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          padding: 6rem 1.5rem 4rem;
          overflow: hidden;
        }

        .hero-inner {
          display: flex;
          align-items: center;
          gap: 4rem;
        }

        .hero-avatar-wrap {
          flex-shrink: 0;
          position: relative;
        }

        .hero-avatar {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cyan-400), var(--cyan-600));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 32px rgba(6,182,212,0.4);
        }

        .hero-avatar-letter {
          font-size: 4rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .hero-avatar-ring {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 2px dashed rgba(6,182,212,0.4);
          animation: spin 20s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-text {
          flex: 1;
        }

        .hero-greeting {
          font-size: 1rem;
          color: var(--cyan-600);
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
        }

        .hero-name {
          font-size: 3.2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.15;
          margin-bottom: 0.5rem;
        }

        .hero-name-accent {
          background: linear-gradient(135deg, var(--cyan-500), var(--cyan-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-title {
          font-size: 1.15rem;
          color: var(--cyan-700);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .hero-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .hero-bio {
          font-size: 0.98rem;
          color: var(--text-body);
          line-height: 1.8;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .hero-blob-1 {
          width: 400px;
          height: 400px;
          background: rgba(6,182,212,0.12);
          top: -100px;
          left: -100px;
        }

        .hero-blob-2 {
          width: 300px;
          height: 300px;
          background: rgba(34,211,238,0.1);
          bottom: 0;
          right: -80px;
        }

        /* SECTIONS */
        .home-section {
          padding: 5rem 0;
        }

        .home-section--alt {
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(8px);
        }

        /* SKILLS */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .skill-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .skill-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(34,211,238,0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan-600);
        }

        .skill-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .skill-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* ARTICLES PREVIEW */
        .articles-preview {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .article-preview-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .article-preview-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .article-preview-summary {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.7;
          flex: 1;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
        }

        .article-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* PROOF CARDS */
        .proof-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .proof-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .proof-year {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .proof-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .proof-client {
          font-size: 0.85rem;
          color: var(--cyan-600);
          font-weight: 600;
        }

        .proof-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        .proof-stat {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: auto;
        }

        /* CTA */
        .home-cta-section {
          padding: 4rem 0 6rem;
        }

        .home-cta-card {
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .home-cta-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cyan-400), var(--cyan-600));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 0.5rem;
          animation: pulse-glow 3s infinite;
        }

        .home-cta-card h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .home-cta-card p {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 480px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .home-hero {
            min-height: auto;
            padding: 3rem 1.25rem 2.5rem;
          }

          .hero-inner {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }

          .hero-avatar {
            width: 120px;
            height: 120px;
          }

          .hero-avatar-letter {
            font-size: 3rem;
          }

          .hero-name {
            font-size: 2.2rem;
          }

          .hero-bio {
            max-width: 100%;
          }

          .hero-cta {
            justify-content: center;
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }

          .articles-preview,
          .proofreading-preview {
            grid-template-columns: 1fr;
          }

          .home-cta-card {
            padding: 2rem 1.25rem;
          }

          .home-cta-card h2 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
