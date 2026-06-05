import QuestionCard from './QuestionCard';

function SectionCard({ section, onAddQuestion }) {
  return (
    <section className="section-card">
      <h2>{section.title}</h2>
      <p>{section.description || 'No description yet.'}</p>

      <div>
        {section.questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      <button onClick={() => onAddQuestion(section.id)}>
        Add Question
      </button>
    </section>
  );
}

export default SectionCard;