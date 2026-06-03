import { Link } from "react-router-dom";

function Forms() {
  const forms = [
    {
      id: "1",
      title: "Customer Feedback Form",
      description: "Collect customer opinions and ratings.",
      responses: 24,
      createdAt: "2026-06-03",
    },
    {
      id: "2",
      title: "Job Application Form",
      description: "Collect job applicants.",
      responses: 12,
      createdAt: "2026-06-02",
    },
  ];

  return (
    <div>
      <div className="page-top">
        <div>
          <h1>Forms</h1>
          <p>Create and manage your forms.</p>
        </div>

        <Link className="primary-btn" to="/create-form">
          New Form
        </Link>
      </div>

      <div className="forms-grid">
        {forms.map((form) => (
          <div className="form-card" key={form.id}>
            <h2>{form.title}</h2>
            <p>{form.description}</p>

            <div className="meta">
              <span>{form.responses} responses</span>
              <span>{form.createdAt}</span>
            </div>

            <button>Open Form</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forms;