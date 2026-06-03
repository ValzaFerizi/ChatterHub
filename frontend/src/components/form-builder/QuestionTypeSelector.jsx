function QuestionTypeSelector({ value }) {
  const questionTypes = [
    'short_answer',
    'paragraph',
    'multiple_choice',
    'checkboxes',
    'dropdown',
    'file_upload',
    'date',
    'time'
  ];

  return (
    <select value={value} disabled>
      {questionTypes.map((type) => (
        <option key={type} value={type}>
          {type.replaceAll('_', ' ')}
        </option>
      ))}
    </select>
  );
}

export default QuestionTypeSelector;