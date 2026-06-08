function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of forms, sheets, and responses.</p>
      </div>

      <div className="stats">
        <div className="card">
          <p>Total Forms</p>
          <h2>12</h2>
        </div>

        <div className="card">
          <p>Total Sheets</p>
          <h2>8</h2>
        </div>

        <div className="card">
          <p>Total Responses</p>
          <h2>1,248</h2>
        </div>

        <div className="card">
          <p>Completion Rate</p>
          <h2>82%</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        <p>New response submitted to Customer Feedback Form</p>
        <p>Job Application Form was updated</p>
        <p>New sheet generated from Event Registration</p>
      </div>
    </div>
  );
}

export default Dashboard;