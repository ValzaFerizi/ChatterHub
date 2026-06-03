import { useState } from 'react';
import SectionCard from '../components/form-builder/SectionCard';
import { createSection, createQuestion } from '../services/formApi';

function FormBuilder() {
  const [formId, setFormId] = useState(1);
  const [sections, setSections] = useState([]);

  const addSection = async () => {
    const newSectionData = {
      title: 'Untitled Section',
      description: '',
      orderIndex: sections.length + 1
    };

    try {
      const response = await createSection(formId, newSectionData);

      setSections([
        ...sections,
        {
          ...response.data,
          questions: []
        }
      ]);
    } catch (error) {
      console.error('Failed to add section:', error);
    }
  };

  const addQuestion = async (sectionId) => {
    const section = sections.find((item) => item.id === sectionId);

    const questionData = {
      sectionId,
      label: 'Untitled Question',
      type: 'short_answer',
      isRequired: false,
      orderIndex: section ? section.questions.length + 1 : 1,
      options: []
    };

    try {
      const response = await createQuestion(formId, questionData);

      setSections(
        sections.map((item) => {
          if (item.id !== sectionId) {
            return item;
          }

          return {
            ...item,
            questions: [...item.questions, response.data]
          };
        })
      );
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  return (
    <main className="form-builder-page">
      <header>
        <h1>Form Builder</h1>
        <p>Add sections and questions for a Google Forms-style builder.</p>
      </header>

      <label>
        Form ID:
        <input
          type="number"
          value={formId}
          onChange={(event) => setFormId(Number(event.target.value))}
        />
      </label>

      <button onClick={addSection}>
        Add Section
      </button>

      <div className="sections-list">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onAddQuestion={addQuestion}
          />
        ))}
      </div>
    </main>
  );
}

export default FormBuilder;