import { HashRouter, Route, Routes, Link } from "react-router-dom";
import Login from "./page/login";
import Home from "./page/Home";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
