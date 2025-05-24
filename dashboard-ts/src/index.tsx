import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Importando estilos en orden correcto
import "./styles/bootstrap-custom.css"; // Estilos personalizados de Bootstrap (incluye bootstrap y bootstrap-icons)
import "./index.css";
import "./styles/global.css";

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
