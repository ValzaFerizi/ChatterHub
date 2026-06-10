import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function CreateForm() {
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { label: 'Untitled Question', type: 'multiple_choice', is_required: false, options: ['Option 1'] }
  ]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { label: 'Untitled Question', type: 'multiple_choice', is_required: false, options: ['Option 1'] }]);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    if (field === 'type') {
      const hasOptions = ['multiple_choice', 'checkboxes', 'dropdown'].includes(value);
      updated[index].options = hasOptions ? ['Option 1'] : [];
    }
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push(`Option ${updated[qIndex].options.length + 1}`);
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const deleteOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(updated);
  };

  const saveForm = async () => {
    if (!title.trim()) return alert('Shto titullin e formës!');
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        questions: questions.map((q, i) => ({
          label: q.label,
          type: q.type,
          is_required: q.is_required,
          order_index: i,
          options: q.options || []
        }))
      };
      await api.post('/forms', payload);
      alert('Forma u ruajt me sukses!');
      navigate('/forms');
    } catch (err) {
      alert('Gabim: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const hasOptions = (type) => ['multiple_choice', 'checkboxes', 'dropdown'].includes(type);
  const isFileUpload = (type) => type === 'file_upload';
  const isPhotoUpload = (type) => type === 'photo_upload';

  return (
    <div className="builder">
      <div className="form-header">
        <input className="form-title" value={title}
          onChange={(e) => setTitle(e.target.value)} />
        <input className="form-description" placeholder="Form description"
          value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {questions.map((q, index) => (
        <div className="question-card" key={index}>
          <div className="question-top">
            <input className="question-title" value={q.label}
              onChange={(e) => updateQuestion(index, 'label', e.target.value)} />
            <select value={q.type}
              onChange={(e) => updateQuestion(index, 'type', e.target.value)}>
              <option value="short_answer">Short answer</option>
              <option value="paragraph">Paragraph</option>
              <option value="multiple_choice">Multiple choice</option>
              <option value="checkboxes">Checkbox</option>
              <option value="dropdown">Dropdown</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="file_upload">📎 File Upload</option>
              <option value="photo_upload">🖼 Photo Upload</option>
            </select>
          </div>

          {hasOptions(q.type) && (
            <div className="options" style={{ marginTop: '10px' }}>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="option-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="circle" style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #6d28d9', display: 'inline-block' }}></span>
                  <input value={opt}
                    onChange={(e) => updateOption(index, oIndex, e.target.value)}
                    style={{ flex: 1, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                  <button onClick={() => deleteOption(index, oIndex)}
                    style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>×</button>
                </div>
              ))}
              <button className="link-btn" onClick={() => addOption(index)}
                style={{ color: '#6d28d9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                + Add option
              </button>
            </div>
          )}

          {isFileUpload(q.type) && (
            <div style={{ marginTop: '10px' }}>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '20px', background: '#f9fafb', borderRadius: '6px',
                border: '1px dashed #d1d5db', textAlign: 'center', cursor: 'pointer'
              }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f9fafb'}
              >
                <span style={{ fontSize: '28px', marginBottom: '6px' }}>📎</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Kliko për të ngarkuar file</span>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>PDF, Word, Excel, CV etj.</span>
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" style={{ display: 'none' }} />
              </label>
            </div>
          )}

          {isPhotoUpload(q.type) && (
            <div style={{ marginTop: '10px' }}>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '20px', background: '#f9fafb', borderRadius: '6px',
                border: '1px dashed #d1d5db', textAlign: 'center', cursor: 'pointer'
              }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f9fafb'}
              >
                <span style={{ fontSize: '28px', marginBottom: '6px' }}>🖼</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Kliko për të ngarkuar foto</span>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>JPG, PNG, GIF, WebP etj.</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </label>
            </div>
          )}

          <div className="question-footer">
            <label>
              <input type="checkbox" checked={q.is_required}
                onChange={(e) => updateQuestion(index, 'is_required', e.target.checked)} />
              Required
            </label>
            <button className="danger-btn" onClick={() => deleteQuestion(index)}>Delete</button>
          </div>
        </div>
      ))}

      <div className="actions">
        <button className="secondary-btn" onClick={addQuestion}>Add Question</button>
        <button className="primary-btn" onClick={saveForm} disabled={saving}>
          {saving ? 'Duke ruajtur...' : 'Save Form'}
        </button>
      </div>
    </div>
  );
}

export default CreateForm;