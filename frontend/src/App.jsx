import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Forms from "./pages/forms";
import Sheets from "./pages/sheets";
import CreateForm from "./pages/createform";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import FormDetail from './pages/FormDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="forms" element={<Forms />} />
            <Route path="sheets" element={<Sheets />} />
            <Route path="create-form" element={<CreateForm />} />
            <Route path="users" element={<Users />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="forms/:id" element={<FormDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
