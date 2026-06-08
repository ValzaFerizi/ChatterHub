import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Forms from "./pages/Forms";
import Sheets from "./pages/Sheets";
import CreateForm from "./pages/CreateForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="forms" element={<Forms />} />
          <Route path="sheets" element={<Sheets />} />
          <Route path="create-form" element={<CreateForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
