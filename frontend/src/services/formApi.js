const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function createSection(formId, sectionData) {
  const response = await fetch(`${API_URL}/api/forms/${formId}/sections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sectionData)
  });

  if (!response.ok) {
    throw new Error('Failed to create section');
  }

  return response.json();
}

export async function createQuestion(formId, questionData) {
  const response = await fetch(`${API_URL}/api/forms/${formId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(questionData)
  });

  if (!response.ok) {
    throw new Error('Failed to create question');
  }

  return response.json();
}