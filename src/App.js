import { HashRouter, Route, Routes, Link } from "react-router-dom";
import Login from "./page/login";
import Home from "./page/Home";
import GenerarQR from "./page/generarqr";
import Services from "./page/services";
import { useState } from "react";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/codigosqr/:param1" element={<GenerarQR />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
