import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Forms from "./pages/forms";
import Sheets from "./pages/sheets";
import CreateForm from "./pages/createform";

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