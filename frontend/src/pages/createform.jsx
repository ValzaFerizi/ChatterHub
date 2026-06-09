import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function CreateForm() {
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { label: 'Untitled Question', type: 'multiple_choice', is_required: false }
  ]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { label: 'Untitled Question', type: 'multiple_choice', is_required: false }]);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const saveForm = async () => {
    if (!title.trim()) return alert('Shto titullin e formës!');
    setSaving(true);
    try {
      await api.post('/forms', { title, description, questions });
      alert('Forma u ruajt me sukses!');
      navigate('/forms');
    } catch (err) {
      alert('Gabim: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

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
            </select>
          </div>
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