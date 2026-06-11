import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/layout";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Forms = lazy(() => import("./pages/forms"));
const Sheets = lazy(() => import("./pages/sheets"));
const CreateForm = lazy(() => import("./pages/createform"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Users = lazy(() => import("./pages/Users"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const FormDetail = lazy(() => import("./pages/FormDetail"));
const Search = lazy(() => import("./pages/Search"));
const Responses = lazy(() => import("./pages/responses"));
const CMSSettings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            Loading...
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="forms" element={<Forms />} />
              <Route path="forms/:id" element={<FormDetail />} />
              <Route path="sheets" element={<Sheets />} />
              <Route path="create-form" element={<CreateForm />} />
              <Route path="search" element={<Search />} />
              <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
              <Route path="audit" element={<AdminRoute><AuditLogs /></AdminRoute>} />
              <Route path="audit-logs" element={<AdminRoute><AuditLogs /></AdminRoute>} />
              <Route path="responses" element={<AdminRoute><Responses /></AdminRoute>} />
              <Route path="cms-settings" element={<AdminRoute><CMSSettings /></AdminRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;