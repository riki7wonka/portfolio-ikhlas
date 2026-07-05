'use client';

import { useState, useEffect } from 'react';
import { BookOpen, FileText, ChevronDown, ChevronUp, Tag } from 'lucide-react';

export default function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      });
  }, []);

  const categories = ['الكل', ...Array.from(new Set(articles.map(a => a.category)))];

  const filtered = activeCategory === 'الكل'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <section className="page-hero">
        <span className="section-tag anim-fade-up anim-delay-1">المدونة</span>
        <h1 className="anim-fade-up anim-delay-2">مقالات ودروس</h1>
        <p className="anim-fade-up anim-delay-3">
          أشاركك تجربتي وأفكاري في تعليم اللغة العربية والكتابة الأدبية
        </p>
      </section>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Filter Tabs */}
        <div className="blog-filters anim-fade-up anim-delay-2">
          {categories.map(cat => (
            <button
              key={cat}
              id={`filter-${cat}`}
              className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="articles-list">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>جاري التحميل...</p>
          ) : (
            <>
          {filtered.map((article, i) => {
            const isExpanded = expanded === article.id;
            return (
              <article
                key={article.id}
                className={`glass-card article-card anim-fade-up anim-delay-${Math.min(i + 1, 5)}`}
              >
                <div className="article-card-header">
                  <div className="article-icon">
                    {article.category === 'درس' ? (
                      <BookOpen size={20} strokeWidth={1.8} />
                    ) : (
                      <FileText size={20} strokeWidth={1.8} />
                    )}
                  </div>
                  <div className="article-info">
                    <div className="article-tags">
                      <span className="badge">
                        <Tag size={11} style={{ display: 'inline', marginLeft: '3px' }} />
                        {article.category}
                      </span>
                      <span className="article-date">{article.date}</span>
                    </div>
                    <h2 className="article-title">{article.title}</h2>
                    <p className="article-summary">{article.summary}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="article-content">
                    <div className="divider" />
                    <p>{article.content}</p>
                    {article.pdfUrl && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.5rem 1.25rem' }}>
                          <FileText size={16} />
                          تحميل أو قراءة المقال (PDF)
                        </a>
                      </div>
                    )}
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '1rem', fontSize: '0.88rem' }}>
                      — إخلاص بوعلام
                    </p>
                  </div>
                )}

                <button
                  id={`toggle-article-${article.id}`}
                  className="article-toggle"
                  onClick={() => setExpanded(isExpanded ? null : article.id)}
                >
                  <span>{isExpanded ? 'إخفاء المقال' : 'قراءة المزيد'}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </article>
            );
          })}

          {filtered.length === 0 && !loading && (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <BookOpen size={40} strokeWidth={1} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
              <p>لا يوجد محتوى في هذه الفئة بعد</p>
            </div>
          )}
          </>
          )}
        </div>
      </div>

      <style>{`
        .blog-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .filter-btn {
          padding: 0.45rem 1.1rem;
          border-radius: 100px;
          border: 1.5px solid rgba(6,182,212,0.3);
          background: rgba(255,255,255,0.6);
          color: var(--text-secondary);
          font-family: var(--font);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--cyan-400);
          background: rgba(6,182,212,0.08);
        }

        .filter-btn--active {
          background: linear-gradient(135deg, var(--cyan-500), var(--cyan-400));
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(6,182,212,0.3);
        }

        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .article-card {
          padding: 1.75rem;
        }

        .article-card-header {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .article-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(34,211,238,0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan-600);
          margin-top: 2px;
        }

        .article-info {
          flex: 1;
        }

        .article-tags {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .article-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .article-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .article-summary {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        .article-content {
          margin-top: 1.25rem;
          font-size: 0.95rem;
          color: var(--text-body);
          line-height: 1.85;
        }

        .article-toggle {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1.25rem;
          background: none;
          border: none;
          color: var(--cyan-600);
          font-family: var(--font);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .article-toggle:hover {
          color: var(--cyan-500);
        }

        @media (max-width: 768px) {
          .article-card-header {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
