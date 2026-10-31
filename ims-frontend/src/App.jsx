import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import PurchaseEntry from "./pages/PurchaseEntry";
import Report from "./pages/Report";
import PurchaseSuccess from "./pages/PurchaseSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/purchase-entry" element={<PurchaseEntry />} />
        <Route path="/report" element={<Report />} />
        <Route
            path="/purchase-success"
            element={<PurchaseSuccess />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;