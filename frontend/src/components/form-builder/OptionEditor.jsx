function OptionEditor({ options }) {
  return (
    <div className="option-editor">
      <strong>Options</strong>

      {options.length === 0 ? (
        <p>No options added yet.</p>
      ) : (
        options.map((option) => (
          <div key={option.id || option.value}>
            {option.label}
          </div>
        ))
      )}
    </div>
  );
}

export default OptionEditor;