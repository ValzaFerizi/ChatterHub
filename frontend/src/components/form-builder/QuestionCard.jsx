import QuestionTypeSelector from './QuestionTypeSelector';
import OptionEditor from './OptionEditor';

function QuestionCard({ question }) {
  const hasOptions = ['multiple_choice', 'checkboxes', 'dropdown'].includes(
    question.type
  );

  return (
    <article className="question-card">
      <h3>{question.label}</h3>

      <QuestionTypeSelector value={question.type} />

      <label>
        <input type="checkbox" checked={question.isRequired} readOnly />
        Required
      </label>

      {hasOptions && <OptionEditor options={question.options || []} />}
    </article>
  );
}

export default QuestionCard;