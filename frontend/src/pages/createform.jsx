import { useState } from "react";

function CreateForm() {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");

  return (
    <div className="builder">
      <div className="form-header">
        <input
          className="form-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="form-description"
          placeholder="Form description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="question-card">
        <div className="question-top">
          <input className="question-title" defaultValue="Untitled Question" />

          <select defaultValue="multiple_choice">
            <option value="short_text">Short answer</option>
            <option value="paragraph">Paragraph</option>
            <option value="multiple_choice">Multiple choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
          </select>
        </div>

        <div className="options">
          <div className="option-row">
            <span className="circle"></span>
            <input defaultValue="Option 1" />
          </div>

          <button className="link-btn">Add option</button>
        </div>

        <div className="question-footer">
          <label>
            <input type="checkbox" />
            Required
          </label>

          <button className="danger-btn">Delete</button>
        </div>
      </div>

      <div className="actions">
        <button className="secondary-btn">Add Question</button>
        <button className="primary-btn">Save Form</button>
      </div>
    </div>
  );
}

export default CreateForm;