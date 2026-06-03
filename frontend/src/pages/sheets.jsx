function Sheets() {
  const sheets = [
    {
      id: "1",
      name: "Customer Feedback Responses",
      linkedForm: "Customer Feedback Form",
      rows: 24,
      columns: 6,
      updatedAt: "2026-06-03",
    },
    {
      id: "2",
      name: "Job Applications",
      linkedForm: "Job Application Form",
      rows: 12,
      columns: 8,
      updatedAt: "2026-06-02",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Sheets</h1>
        <p>Response tables connected to forms.</p>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Sheet Name</th>
              <th>Linked Form</th>
              <th>Rows</th>
              <th>Columns</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody>
            {sheets.map((sheet) => (
              <tr key={sheet.id}>
                <td>{sheet.name}</td>
                <td>{sheet.linkedForm}</td>
                <td>{sheet.rows}</td>
                <td>{sheet.columns}</td>
                <td>{sheet.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sheets;