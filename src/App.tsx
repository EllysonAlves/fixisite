import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Produtos from "./pages/dashboard/produtos";
import ConfiguracaoTenant from "./pages/dashboard/configuracao";
import Temas from "./pages/dashboard/temas";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Páginas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Produtos />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <ConfiguracaoTenant />
              </PrivateRoute>
            }
          />
          <Route
            path="/temas"
            element={
              <PrivateRoute>
                <Temas />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
