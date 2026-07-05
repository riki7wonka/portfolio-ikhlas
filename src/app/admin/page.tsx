'use client';

import { useState, useEffect } from 'react';
import { Lock, Settings, User, BookOpen, FileText, Award, Eye, EyeOff, Plus, Trash2, Save, Image as ImageIcon, CheckCircle, Target } from 'lucide-react';

const ADMIN_PASSWORD = 'ikhlas2026';

type Section = 'profile' | 'skills' | 'portfolio' | 'articles' | 'tests';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin_auth') === 'true') {
      setLoggedIn(true);
    }

    fetch('/api/data')
      .then(res => res.json())
      .then(d => {
        if (!d.skills) d.skills = [];
        if (!d.siteOwner) d.siteOwner = {};
        if (!d.proofreadingWorks) d.proofreadingWorks = [];
        if (!d.articles) d.articles = [];
        if (!d.tests) d.tests = [];
        setData(d);
        setLoading(false);
      });
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError('');
      if (rememberMe) {
        localStorage.setItem('admin_auth', 'true');
      }
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    setPassword('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_auth');
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaveMessage('تم الحفظ بنجاح!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      setSaveMessage('حدث خطأ أثناء الاتصال بالخادم');
    }
    setSaving(false);
  }

  if (!loggedIn) {
    return (
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card login-card anim-fade-up">
          <div className="login-icon">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h1 className="login-title">لوحة التحكم</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>كلمة المرور</label>
              <div className="pass-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="أدخلي كلمة المرور"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', width: '100%' }}>
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>تذكرني دائماً</label>
            </div>

            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              دخول
            </button>
          </form>
        </div>
        <style>{`
          .login-card { max-width: 400px; width: 100%; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
          .login-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--cyan-500), var(--cyan-400)); display: flex; align-items: center; justify-content: center; color: white; }
          .login-title { font-size: 1.5rem; font-weight: 800; }
          .login-form { width: 100%; }
          .pass-input-wrap { position: relative; }
          .pass-input-wrap input { padding-left: 2.5rem; }
          .pass-toggle { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; }
          .form-error { color: #dc2626; font-size: 0.88rem; background: rgba(239,68,68,0.08); padding: 0.5rem; border-radius: var(--radius-sm); margin-bottom: 0.5rem; text-align: center; }
        `}</style>
      </div>
    );
  }

  if (loading || !data) return <div style={{ padding: '6rem', textAlign: 'center' }}>جاري تحميل البيانات...</div>;

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'البيانات الشخصية', icon: <User size={18} /> },
    { id: 'skills', label: 'المهارات', icon: <Target size={18} /> },
    { id: 'portfolio', label: 'معرض الأعمال', icon: <FileText size={18} /> },
    { id: 'articles', label: 'المقالات والدروس', icon: <BookOpen size={18} /> },
    { id: 'tests', label: 'الاختبارات', icon: <Award size={18} /> },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <section className="page-hero" style={{ padding: '4rem 1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Settings size={28} strokeWidth={1.8} style={{ color: 'var(--cyan-600)' }} />
            <h1 style={{ marginBottom: 0 }}>لوحة التحكم</h1>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', borderColor: '#ef4444', color: '#ef4444' }}>
            تسجيل الخروج
          </button>
        </div>
      </section>

      <div className="container admin-container">
        {/* Sidebar */}
        <nav className="admin-tabs glass-card">
          {sections.map(sec => (
            <button
              key={sec.id}
              className={`admin-tab-btn ${activeSection === sec.id ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(6,182,212,0.1)' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} />
              {saving ? 'جاري الحفظ...' : 'حفظ جميع التعديلات'}
            </button>
            {saveMessage && (
              <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem', color: saveMessage.includes('نجاح') ? '#10b981' : '#ef4444' }}>
                {saveMessage}
              </p>
            )}
          </div>
        </nav>

        {/* Content Area */}
        <div className="admin-content glass-card">
          {activeSection === 'profile' && <ProfileSection data={data.siteOwner} update={(updates: any) => setData({...data, siteOwner: {...data.siteOwner, ...updates}})} />}
          {activeSection === 'skills' && <SkillsSection data={data.skills} update={(skills: any) => setData({...data, skills})} />}
          {activeSection === 'portfolio' && <PortfolioSection data={data.proofreadingWorks} update={(works: any) => setData({...data, proofreadingWorks: works})} />}
          {activeSection === 'articles' && <ArticlesSection data={data.articles} update={(articles: any) => setData({...data, articles})} />}
          {activeSection === 'tests' && <TestsSection data={data.tests} update={(tests: any) => setData({...data, tests})} />}
        </div>
      </div>

      <style>{`
        .admin-container { display: grid; grid-template-columns: 240px 1fr; gap: 1.5rem; padding-bottom: 6rem; align-items: start; }
        .admin-tabs { padding: 1rem; display: flex; flex-direction: column; gap: 0.3rem; position: sticky; top: 6rem; min-height: calc(100vh - 8rem); }
        .admin-tab-btn { display: flex; align-items: center; gap: 0.65rem; padding: 0.7rem 1rem; border-radius: var(--radius-sm); border: none; background: none; color: var(--text-secondary); font-family: var(--font); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: right; }
        .admin-tab-btn:hover { background: rgba(6,182,212,0.08); color: var(--cyan-700); }
        .admin-tab-btn--active { background: rgba(6,182,212,0.12); color: var(--cyan-700); font-weight: 700; border-right: 3px solid var(--cyan-500); }
        .admin-content { padding: 2rem; }
        .admin-section-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary); }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .admin-list-item { background: rgba(255,255,255,0.5); border: 1px solid rgba(6,182,212,0.15); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1rem; position: relative; }
        .remove-btn { position: absolute; top: 1rem; left: 1rem; background: rgba(239,68,68,0.1); color: #ef4444; border: none; padding: 0.4rem; border-radius: 4px; cursor: pointer; }
        .remove-btn:hover { background: rgba(239,68,68,0.2); }
        .add-btn { display: flex; align-items: center; gap: 0.5rem; background: rgba(6,182,212,0.1); color: var(--cyan-700); border: 1px dashed var(--cyan-500); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-family: var(--font); font-weight: 600; cursor: pointer; width: 100%; justify-content: center; margin-top: 1rem; }
        
        @media (max-width: 768px) {
          .admin-container { grid-template-columns: 1fr; }
          .admin-tabs { position: static; flex-direction: row; overflow-x: auto; gap: 0.25rem; padding: 0.75rem; min-height: auto; flex-wrap: wrap; }
          .admin-tab-btn { flex-shrink: 0; padding: 0.5rem 0.75rem; border-right: none; }
          .admin-tab-btn--active { border-bottom: 3px solid var(--cyan-500); }
          .form-row { grid-template-columns: 1fr; }
          .admin-content { padding: 1rem; }
          .options-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

// =================== PROFILE SECTION ===================
function ProfileSection({ data, update }: any) {
  const [uploading, setUploading] = useState(false);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.url) update({ photo: result.url });
    } catch (err) {
      alert('فشل رفع الصورة');
    }
    setUploading(false);
  }

  return (
    <div>
      <h2 className="admin-section-title">البيانات الشخصية</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {data.photo ? <img src={data.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="#aaa" />}
        </div>
        <div>
          <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
            <ImageIcon size={16} />
            {uploading ? 'جاري الرفع...' : 'تغيير الصورة'}
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group"><label>الاسم</label><input value={data.firstName || ''} onChange={e => update({ firstName: e.target.value })} /></div>
        <div className="form-group"><label>اللقب</label><input value={data.lastName || ''} onChange={e => update({ lastName: e.target.value })} /></div>
      </div>
      <div className="form-group"><label>المسمى الوظيفي</label><input value={data.title || ''} onChange={e => update({ title: e.target.value })} /></div>
      <div className="form-group"><label>العنوان الفرعي</label><input value={data.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} /></div>
      <div className="form-group"><label>النبذة الذاتية</label><textarea value={data.bio || ''} onChange={e => update({ bio: e.target.value })} style={{ minHeight: '120px' }} /></div>
      <div className="form-row">
        <div className="form-group"><label>البريد الإلكتروني</label><input value={data.email || ''} onChange={e => update({ email: e.target.value })} /></div>
        <div className="form-group"><label>رقم الهاتف</label><input value={data.phone || ''} onChange={e => update({ phone: e.target.value })} /></div>
      </div>
      <div className="form-group"><label>الموقع الجغرافي</label><input value={data.location || ''} onChange={e => update({ location: e.target.value })} /></div>

      {/* Stats Section */}
      <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(6,182,212,0.05)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(6,182,212,0.3)' }}>
        <p style={{ fontWeight: 700, color: 'var(--cyan-700)', marginBottom: '1rem', fontSize: '0.95rem' }}>
          📊 الإحصائيات التي تظهر في معرض الأعمال
          <span style={{ display: 'block', fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
            اتركيها فارغة إذا لم تريدي إظهارها، وضعي الرقم مع الوحدة مثلاً: 500+ أو 5 سنوات
          </span>
        </p>
        <div className="form-row">
          <div className="form-group">
            <label>عدد المشاريع المنجزة</label>
            <input placeholder="مثال: 20+" value={data.projectsCompleted || ''} onChange={e => update({ projectsCompleted: e.target.value })} />
          </div>
          <div className="form-group">
            <label>الصفحات المدققة</label>
            <input placeholder="مثال: 1000+" value={data.pagesProofread || ''} onChange={e => update({ pagesProofread: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>سنوات الخبرة</label>
            <input placeholder="مثال: 5+" value={data.yearsExperience || ''} onChange={e => update({ yearsExperience: e.target.value })} />
          </div>
          <div className="form-group">
            <label>رضا العملاء</label>
            <input placeholder="مثال: 100%" value={data.customerSatisfaction || ''} onChange={e => update({ customerSatisfaction: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== SKILLS SECTION ===================
function SkillsSection({ data, update }: any) {
  function addSkill() {
    update([...data, { id: Date.now(), title: '', description: '' }]);
  }
  function removeSkill(index: number) {
    update(data.filter((_: any, i: number) => i !== index));
  }
  function updateSkill(index: number, key: string, val: string) {
    const newData = [...data];
    newData[index][key] = val;
    update(newData);
  }

  return (
    <div>
      <h2 className="admin-section-title">المهارات</h2>
      {data.map((skill: any, i: number) => (
        <div key={skill.id || i} className="admin-list-item">
          <button className="remove-btn" onClick={() => removeSkill(i)} title="حذف"><Trash2 size={16} /></button>
          <div className="form-group"><label>العنوان</label><input value={skill.title || ''} onChange={e => updateSkill(i, 'title', e.target.value)} /></div>
          <div className="form-group"><label>الوصف</label><textarea value={skill.description || ''} onChange={e => updateSkill(i, 'description', e.target.value)} /></div>
        </div>
      ))}
      <button className="add-btn" onClick={addSkill}><Plus size={16} /> إضافة مهارة جديدة</button>
    </div>
  );
}

// =================== PORTFOLIO SECTION ===================
function PortfolioSection({ data, update }: any) {
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  function addWork() {
    update([...data, { id: Date.now(), title: '', client: '', type: '', description: '', year: '', pages: '', pdfUrl: '' }]);
  }
  function removeWork(index: number) {
    update(data.filter((_: any, i: number) => i !== index));
  }
  function updateWork(index: number, key: string, val: string) {
    const newData = [...data];
    newData[index][key] = val;
    update(newData);
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    if (!e.target.files || !e.target.files[0]) return;
    setUploadingFor(index);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.url) updateWork(index, 'pdfUrl', result.url);
    } catch (err) {
      alert('فشل رفع الملف');
    }
    setUploadingFor(null);
  }

  return (
    <div>
      <h2 className="admin-section-title">معرض الأعمال</h2>
      {data.map((work: any, i: number) => (
        <div key={work.id || i} className="admin-list-item">
          <button className="remove-btn" onClick={() => removeWork(i)} title="حذف"><Trash2 size={16} /></button>
          <div className="form-row">
            <div className="form-group"><label>عنوان العمل</label><input value={work.title || ''} onChange={e => updateWork(i, 'title', e.target.value)} /></div>
            <div className="form-group"><label>العميل</label><input value={work.client || ''} onChange={e => updateWork(i, 'client', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>التصنيف (النوع)</label>
              <input placeholder="مثال: كتاب تعليمي، قصة، بحث..." value={work.type || ''} onChange={e => updateWork(i, 'type', e.target.value)} />
            </div>
            <div className="form-group"><label>السنة</label><input value={work.year || ''} onChange={e => updateWork(i, 'year', e.target.value)} /></div>
          </div>
          <div className="form-group"><label>حجم العمل (صفحات)</label><input value={work.pages || ''} onChange={e => updateWork(i, 'pages', e.target.value)} /></div>
          <div className="form-group"><label>الوصف</label><textarea value={work.description || ''} onChange={e => updateWork(i, 'description', e.target.value)} style={{ minHeight: '80px' }} /></div>
          
          <div className="form-group" style={{ marginTop: '0.5rem', background: 'rgba(6,182,212,0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <label>ملف الرواية / العمل (PDF) - اختياري</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <label className="btn btn-outline" style={{ cursor: 'pointer', padding: '0.4rem 1rem' }}>
                <FileText size={16} />
                {uploadingFor === i ? 'جاري الرفع...' : 'رفع ملف PDF'}
                <input type="file" hidden accept=".pdf" onChange={(e) => handlePdfUpload(e, i)} />
              </label>
              {work.pdfUrl && (
                <>
                  <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan-600)', fontSize: '0.9rem', fontWeight: 600 }}>عرض الملف الحالي</a>
                  <button className="btn" style={{ color: '#ef4444', padding: '0.4rem 1rem' }} onClick={() => updateWork(i, 'pdfUrl', '')}>حذف الملف</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={addWork}><Plus size={16} /> إضافة عمل جديد</button>
    </div>
  );
}

// =================== ARTICLES SECTION ===================
function ArticlesSection({ data, update }: any) {
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  function addArticle() {
    update([...data, { id: Date.now(), title: '', category: '', date: new Date().toLocaleDateString('ar-EG'), summary: '', content: '', pdfUrl: '' }]);
  }
  function removeArticle(index: number) {
    update(data.filter((_: any, i: number) => i !== index));
  }
  function updateArticle(index: number, key: string, val: string) {
    const newData = [...data];
    newData[index][key] = val;
    update(newData);
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    if (!e.target.files || !e.target.files[0]) return;
    setUploadingFor(index);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.url) updateArticle(index, 'pdfUrl', result.url);
    } catch (err) {
      alert('فشل رفع الملف');
    }
    setUploadingFor(null);
  }

  return (
    <div>
      <h2 className="admin-section-title">المقالات والدروس</h2>
      {data.map((art: any, i: number) => (
        <div key={art.id || i} className="admin-list-item">
          <button className="remove-btn" onClick={() => removeArticle(i)} title="حذف"><Trash2 size={16} /></button>
          <div className="form-row">
            <div className="form-group"><label>العنوان</label><input value={art.title || ''} onChange={e => updateArticle(i, 'title', e.target.value)} /></div>
            <div className="form-group">
              <label>التصنيف</label>
              <input placeholder="مثال: مقال أدبي، درس..." value={art.category || ''} onChange={e => updateArticle(i, 'category', e.target.value)} />
            </div>
          </div>
          <div className="form-group"><label>التاريخ</label><input value={art.date || ''} onChange={e => updateArticle(i, 'date', e.target.value)} /></div>
          <div className="form-group"><label>الملخص</label><textarea value={art.summary || ''} onChange={e => updateArticle(i, 'summary', e.target.value)} style={{ minHeight: '60px' }} /></div>
          <div className="form-group"><label>المحتوى</label><textarea value={art.content || ''} onChange={e => updateArticle(i, 'content', e.target.value)} style={{ minHeight: '150px' }} /></div>
          
          <div className="form-group" style={{ marginTop: '0.5rem', background: 'rgba(6,182,212,0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <label>إرفاق ملف PDF للتحميل - اختياري</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <label className="btn btn-outline" style={{ cursor: 'pointer', padding: '0.4rem 1rem' }}>
                <FileText size={16} />
                {uploadingFor === i ? 'جاري الرفع...' : 'رفع ملف PDF'}
                <input type="file" hidden accept=".pdf" onChange={(e) => handlePdfUpload(e, i)} />
              </label>
              {art.pdfUrl && (
                <>
                  <a href={art.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan-600)', fontSize: '0.9rem', fontWeight: 600 }}>عرض الملف الحالي</a>
                  <button className="btn" style={{ color: '#ef4444', padding: '0.4rem 1rem' }} onClick={() => updateArticle(i, 'pdfUrl', '')}>حذف الملف</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={addArticle}><Plus size={16} /> إضافة مقال جديد</button>
    </div>
  );
}

// =================== TESTS SECTION ===================
function TestsSection({ data, update }: any) {
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  function addTest() {
    update([...data, { id: Date.now(), title: '', grade: '', description: '', image: '', questions: [] }]);
  }
  function removeTest(index: number) {
    update(data.filter((_: any, i: number) => i !== index));
  }
  function updateTest(index: number, key: string, val: any) {
    const newData = [...data];
    newData[index][key] = val;
    update(newData);
  }
  
  // Questions management
  function addQuestion(testIndex: number) {
    const newData = [...data];
    newData[testIndex].questions.push({ id: `q${Date.now()}`, text: '', options: ['', '', '', ''], correct: 0 });
    update(newData);
  }
  function removeQuestion(testIndex: number, qIndex: number) {
    const newData = [...data];
    newData[testIndex].questions.splice(qIndex, 1);
    update(newData);
  }
  function updateQuestion(testIndex: number, qIndex: number, key: string, val: any) {
    const newData = [...data];
    newData[testIndex].questions[qIndex][key] = val;
    update(newData);
  }
  function updateOption(testIndex: number, qIndex: number, optIndex: number, val: string) {
    const newData = [...data];
    newData[testIndex].questions[qIndex].options[optIndex] = val;
    update(newData);
  }

  async function handleTestImageUpload(e: React.ChangeEvent<HTMLInputElement>, testIndex: number) {
    if (!e.target.files || !e.target.files[0]) return;
    setUploadingFor(testIndex);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.url) updateTest(testIndex, 'image', result.url);
    } catch (err) {
      alert('فشل رفع الصورة');
    }
    setUploadingFor(null);
  }

  return (
    <div>
      <h2 className="admin-section-title">صانع الاختبارات</h2>
      {data.map((test: any, i: number) => (
        <div key={test.id || i} className="admin-list-item" style={{ border: '2px solid var(--cyan-400)', padding: '2rem' }}>
          <button className="remove-btn" onClick={() => removeTest(i)} title="حذف الاختبار"><Trash2 size={16} /></button>
          
          <div className="form-row">
            <div className="form-group"><label>عنوان الاختبار</label><input value={test.title || ''} onChange={e => updateTest(i, 'title', e.target.value)} /></div>
            <div className="form-group"><label>المرحلة / الصف</label><input value={test.grade || ''} onChange={e => updateTest(i, 'grade', e.target.value)} /></div>
          </div>
          <div className="form-group"><label>وصف الاختبار</label><textarea value={test.description || ''} onChange={e => updateTest(i, 'description', e.target.value)} style={{ minHeight: '60px' }} /></div>
          
          <div className="form-group">
            <label>صورة الاختبار (اختياري)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {test.image && <img src={test.image} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }} />}
              <label className="btn btn-outline" style={{ cursor: 'pointer', padding: '0.4rem 1rem' }}>
                <ImageIcon size={16} />
                {uploadingFor === i ? 'جاري الرفع...' : 'رفع صورة'}
                <input type="file" hidden accept="image/*" onChange={(e) => handleTestImageUpload(e, i)} />
              </label>
              {test.image && <button className="btn" style={{ color: '#ef4444' }} onClick={() => updateTest(i, 'image', '')}>مسح الصورة</button>}
            </div>
          </div>

          <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.7)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>الأسئلة</h3>
            {test.questions.map((q: any, qi: number) => (
              <div key={q.id || qi} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                <button className="remove-btn" style={{ top: 0, padding: '0.2rem' }} onClick={() => removeQuestion(i, qi)} title="حذف السؤال"><Trash2 size={14} /></button>
                <div className="form-group"><label>السؤال {qi + 1}</label><input value={q.text || ''} onChange={e => updateQuestion(i, qi, 'text', e.target.value)} /></div>
                
                <div className="options-grid">
                  {q.options.map((opt: string, oi: number) => (
                    <div key={oi} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="radio" name={`correct-${i}-${qi}`} checked={q.correct === oi} onChange={() => updateQuestion(i, qi, 'correct', oi)} title="تحديد كإجابة صحيحة" style={{ width: 'auto' }} />
                      <input value={opt || ''} onChange={e => updateOption(i, qi, oi, e.target.value)} placeholder={`الخيار ${['أ', 'ب', 'ج', 'د'][oi]}`} style={{ width: '100%' }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => addQuestion(i)}>
              <Plus size={16} /> إضافة سؤال جديد
            </button>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={addTest}><Plus size={16} /> إنشاء اختبار جديد</button>
    </div>
  );
}
