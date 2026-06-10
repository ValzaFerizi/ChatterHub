import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useSocket } from '../hooks/useSocket';

function FormDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const socketRef = useSocket()
  const [activeUsers, setActiveUsers] = useState([])

  useEffect(() => {
    api.get(`/forms/${id}`)
      .then(res => setForm(res.data.data || res.data))
      .catch(() => navigate('/forms'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
  const socket = socketRef.current
  if (!socket || !id) return
  socket.emit('form:join', { formId: id })
  socket.on('presence:form_users', ({ users }) => setActiveUsers(users))
  return () => {
    socket.emit('form:leave', { formId: id })
    socket.off('presence:form_users')
  }
}, [socketRef, id])

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitForm = async () => {
    const required = form.questions?.filter(q => q.is_required);
    const missing = required?.find(q => !answers[q.id]);
    if (missing) {
      alert(`Pyetja "${missing.label}" është e detyrueshme!`);
      return;
    }

    setSubmitting(true);
    try {
      const answerList = Object.keys(answers).map(questionId => ({
        questionId: parseInt(questionId),
        value: answers[questionId]
      }));
      await api.post(`/responses/forms/${id}/responses`, { answers: answerList });
      setSubmitted(true);
    } catch (err) {
      alert('Gabim gjatë dërgimit: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (!form) return <div style={{ padding: '20px' }}>Forma nuk u gjet.</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{form.title}</h1>
          <p style={{ color: '#6b7280' }}>{form.description}</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate('/forms')}>← Kthehu</button>
      </div>

      <div className="panel" style={{ marginTop: '20px' }}>
        <h2 style={{ marginBottom: '16px' }}>
          {submitted ? '✅ Përgjigja u dërgua!' : 'Plotëso Formën'}
        </h2>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '18px', color: '#16a34a', marginBottom: '16px' }}>
              Faleminderit! Përgjigja juaj u regjistrua me sukses.
            </p>
            <button className="primary-btn" onClick={() => { setSubmitted(false); setAnswers({}); }}>
              Plotëso përsëri
            </button>
          </div>
        ) : (
          <>
            {form.questions?.length === 0 ? (
              <p style={{ color: '#6b7280' }}>Kjo formë nuk ka pyetje akoma.</p>
            ) : (
              form.questions?.map((q, i) => (
                <div key={q.id} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ fontWeight: '600', marginBottom: '10px' }}>
                    {i + 1}. {q.label}
                    {q.is_required && <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>}
                  </p>

                  {q.type === 'short_answer' && (
                    <input type="text"
                      placeholder="Përgjigja juaj..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                  )}

                  {q.type === 'paragraph' && (
                    <textarea
                      placeholder="Përgjigja juaj..."
                      rows={4}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                  )}

                  {q.type === 'multiple_choice' && (
                    <div>
                      {q.options?.map(opt => (
                        <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={opt.label}
                            checked={answers[q.id] === opt.label}
                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                          />
                          <span style={{ fontSize: '14px' }}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'checkboxes' && (
                    <div>
                      {q.options?.map(opt => (
                        <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            value={opt.label}
                            checked={(answers[q.id] || []).includes(opt.label)}
                            onChange={(e) => {
                              const current = answers[q.id] || [];
                              if (e.target.checked) {
                                handleAnswer(q.id, [...current, opt.label]);
                              } else {
                                handleAnswer(q.id, current.filter(v => v !== opt.label));
                              }
                            }}
                          />
                          <span style={{ fontSize: '14px' }}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'dropdown' && (
                    <select
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                      <option value="">Zgjidh një opsion...</option>
                      {q.options?.map(opt => (
                        <option key={opt.id} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  )}

                  {q.type === 'date' && (
                    <input type="date"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                  )}

                  {q.type === 'time' && (
                    <input type="time"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                  )}
                </div>
              ))
            )}

            {form.questions?.length > 0 && (
              <button
                className="primary-btn"
                onClick={submitForm}
                disabled={submitting}
                style={{ marginTop: '8px' }}>
                {submitting ? 'Duke dërguar...' : 'Dërgo Përgjigjen'}
              </button>
            )}
          </>
        )}
      </div>

      <div className="panel" style={{ marginTop: '20px' }}>
        <h2>Përgjigjet — {form.responses?.length || 0} gjithsej</h2>
      </div>
      {activeUsers.length > 0 && (
  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: '12px 0' }}>
    <span style={{ fontSize: '13px', color: '#6b7280' }}>Duke parë tani:</span>
    {activeUsers.map((u, i) => (
      <div key={i} title={u.username} style={{
        width: 30, height: 30, borderRadius: '50%',
        background: '#6d28d9', color: '#fff',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '13px', fontWeight: 600
      }}>
        {u.username?.[0]?.toUpperCase()}
      </div>
    ))}
  </div>
)}
    </div>
  );
}

export default FormDetail;