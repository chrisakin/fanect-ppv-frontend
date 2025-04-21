import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./screens/Home";
import { AboutUs } from "./screens/AboutUs";
import { PrivacyPolicy } from "./screens/PrivacyPolicy";
import { Terms } from "./screens/Terms";
import { Event } from "./screens/Event";
import { ThemeProvider } from "./components/layout/ThemeProvider";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/event/:id" element={<Event />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>,
);