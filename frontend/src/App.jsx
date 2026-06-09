import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Forms from "./pages/forms";
import Sheets from "./pages/sheets";
import CreateForm from "./pages/createform";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/users";
import Responses from "./pages/responses";
import AuditLogs from "./pages/auditlogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="forms" element={<Forms />} />
          <Route path="sheets" element={<Sheets />} />
          <Route path="create-form" element={<CreateForm />} />
          <Route path="users" element={<Users />} />
          <Route path="responses" element={<Responses />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
   
  export default App;