'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Award, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function TestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [activeTest, setActiveTest] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setTests(data.tests || []);
        setLoading(false);
      });
  }, []);

  const currentTest = tests.find((t: any) => t.id === activeTest);
  const score = currentTest
    ? currentTest.questions.filter((q: any) => answers[q.id] === q.correct).length
    : 0;

  function handleAnswer(qId: string, optIdx: number) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  }

  function handleSubmit() {
    if (!currentTest) return;
    const answered = currentTest.questions.filter((q: any) => answers[q.id] !== undefined).length;
    if (answered < currentTest.questions.length) return;
    setSubmitted(true);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setActiveTest(null);
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <section className="page-hero">
        <span className="section-tag anim-fade-up anim-delay-1">الاختبارات</span>
        <h1 className="anim-fade-up anim-delay-2">اختبارات تفاعلية</h1>
        <p className="anim-fade-up anim-delay-3">
          اختبارات ممتعة وتعليمية في اللغة العربية مصممة خصيصاً للأطفال
        </p>
      </section>

      <div className="container" style={{ paddingBottom: '6rem' }}>

        {/* Test List */}
        {activeTest === null && (
          <div className="tests-grid anim-fade-up anim-delay-2">
            {loading ? (
               <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>جاري التحميل...</p>
            ) : tests.map((test: any, i: number) => (
              <div key={test.id} className={`glass-card test-card anim-fade-up anim-delay-${i + 1}`}>
                <div className="test-card-top">
                  <div className="test-icon">
                    {test.image ? (
                      <img src={test.image} alt={test.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                    ) : (
                      <Award size={24} strokeWidth={1.8} />
                    )}
                  </div>
                  <span className="badge">{test.grade}</span>
                </div>
                <h2 className="test-title">{test.title}</h2>
                <p className="test-desc">{test.description}</p>
                <div className="test-info">
                  <span>{test.questions.length} أسئلة</span>
                </div>
                <button
                  id={`start-test-${test.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  onClick={() => {
                    setActiveTest(test.id);
                    setAnswers({});
                    setSubmitted(false);
                  }}
                >
                  ابدأ الاختبار
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Test */}
        {currentTest && !submitted && (
          <div className="quiz-wrapper anim-fade-up">
            <div className="quiz-header glass-card">
              <h2 className="quiz-title">{currentTest.title}</h2>
              <span className="badge">{currentTest.grade}</span>
              <div className="quiz-progress">
                <div
                  className="quiz-progress-bar"
                  style={{
                    width: `${(Object.keys(answers).length / currentTest.questions.length) * 100}%`
                  }}
                />
              </div>
              <span className="quiz-progress-text">
                {Object.keys(answers).length} / {currentTest.questions.length} سؤال
              </span>
            </div>

            {currentTest.questions.map((q: any, qi: number) => (
              <div key={q.id} className="glass-card question-card">
                <h3 className="question-text">
                  <span className="question-num">{qi + 1}</span>
                  {q.text}
                </h3>
                <div className="options-list">
                  {q.options.map((opt: string, oi: number) => (
                    <button
                      key={oi}
                      id={`q${q.id}-opt${oi}`}
                      className={`quiz-option ${answers[q.id] === oi ? 'selected' : ''}`}
                      onClick={() => handleAnswer(q.id, oi)}
                    >
                      <span className="option-letter">
                        {['أ', 'ب', 'ج', 'د'][oi]}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="quiz-actions">
              <button
                id="back-to-tests"
                className="btn btn-outline"
                onClick={handleReset}
              >
                <RefreshCw size={16} />
                العودة للاختبارات
              </button>
              <button
                id="submit-quiz"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < currentTest.questions.length}
              >
                <CheckCircle size={16} />
                إرسال الإجابات
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {currentTest && submitted && (
          <div className="quiz-result anim-fade-up">
            <div className="glass-card result-card">
              <div className={`result-icon ${score === currentTest.questions.length ? 'result-icon--perfect' : score >= currentTest.questions.length / 2 ? 'result-icon--good' : 'result-icon--low'}`}>
                <Award size={48} strokeWidth={1.5} />
              </div>
              <h2 className="result-title">
                {score === currentTest.questions.length
                  ? 'ممتاز! أنت رائع!'
                  : score >= currentTest.questions.length / 2
                  ? 'جيد! يمكنك التحسين!'
                  : 'حاول مرة أخرى!'}
              </h2>
              <div className="result-score">
                <span className="score-num">{score}</span>
                <span className="score-total">/ {currentTest.questions.length}</span>
              </div>
              <p className="result-percent">
                النسبة: {Math.round((score / currentTest.questions.length) * 100)}%
              </p>
            </div>

            {/* Answer Review */}
            {currentTest.questions.map((q: any, qi: number) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={q.id} className="glass-card question-card">
                  <h3 className="question-text">
                    <span className="question-num">{qi + 1}</span>
                    {q.text}
                    {isCorrect
                      ? <CheckCircle size={18} style={{ color: '#10b981', marginRight: '0.5rem' }} />
                      : <XCircle size={18} style={{ color: '#ef4444', marginRight: '0.5rem' }} />}
                  </h3>
                  <div className="options-list">
                    {q.options.map((opt: string, oi: number) => (
                      <div
                        key={oi}
                        className={`quiz-option ${oi === q.correct ? 'correct' : oi === userAnswer && !isCorrect ? 'wrong' : ''}`}
                      >
                        <span className="option-letter">{['أ', 'ب', 'ج', 'د'][oi]}</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <button
              id="retry-test"
              className="btn btn-primary"
              style={{ margin: '0 auto', display: 'flex' }}
              onClick={handleReset}
            >
              <RefreshCw size={16} />
              اختبار آخر
            </button>
          </div>
        )}
      </div>

      <style>{`
        .tests-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .test-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .test-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .test-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(34,211,238,0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan-600);
        }

        .test-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .test-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.7;
          flex: 1;
        }

        .test-info {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
          display: flex;
          gap: 1rem;
        }

        .quiz-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .quiz-header {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .quiz-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .quiz-progress {
          height: 6px;
          background: rgba(6,182,212,0.15);
          border-radius: 100px;
          overflow: hidden;
        }

        .quiz-progress-bar {
          height: 100%;
          background: linear-gradient(to left, var(--cyan-400), var(--cyan-600));
          border-radius: 100px;
          transition: width 0.4s ease;
        }

        .quiz-progress-text {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .question-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-text {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .question-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cyan-500), var(--cyan-400));
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .option-letter {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(6,182,212,0.12);
          color: var(--cyan-700);
          font-size: 0.78rem;
          font-weight: 700;
          flex-shrink: 0;
          margin-left: 0.75rem;
          transition: background 0.2s;
        }

        .quiz-option.selected .option-letter {
          background: var(--cyan-500);
          color: white;
        }

        .quiz-option.correct .option-letter {
          background: #10b981;
          color: white;
        }

        .quiz-option.wrong .option-letter {
          background: #ef4444;
          color: white;
        }

        .quiz-actions {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
        }

        .quiz-actions .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* NEW OPTIONS STYLING */
        .quiz-option {
          display: flex;
          align-items: center;
          width: 100%;
          text-align: right;
          padding: 1rem 0.5rem;
          border: 2px solid rgba(6,182,212,0.15);
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          font-size: 1.05rem;
          color: var(--text-primary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .quiz-option:hover {
          border-color: var(--cyan-400);
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6,182,212,0.1);
        }

        .quiz-option.selected {
          border-color: var(--cyan-600);
          background: rgba(6,182,212,0.08);
          font-weight: 700;
        }

        /* Results */
        .quiz-result {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .result-card {
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .result-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-icon--perfect {
          background: linear-gradient(135deg, #f59e0b, #fcd34d);
          color: white;
          box-shadow: 0 8px 24px rgba(245,158,11,0.4);
        }

        .result-icon--good {
          background: linear-gradient(135deg, var(--cyan-500), var(--cyan-400));
          color: white;
          box-shadow: 0 8px 24px rgba(6,182,212,0.4);
        }

        .result-icon--low {
          background: linear-gradient(135deg, #ef4444, #f87171);
          color: white;
          box-shadow: 0 8px 24px rgba(239,68,68,0.3);
        }

        .result-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .result-score {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .score-num {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--cyan-600), var(--cyan-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .score-total {
          font-size: 1.5rem;
          color: var(--text-muted);
        }

        .result-percent {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .tests-grid {
            grid-template-columns: 1fr;
          }

          .quiz-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
