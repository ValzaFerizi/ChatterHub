import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh'}}>Duke u ngarkuar...</div>}>
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
