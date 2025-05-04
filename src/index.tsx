import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Home } from "./screens/Home";
import { AboutUs } from "./screens/AboutUs";
import { PrivacyPolicy } from "./screens/PrivacyPolicy";
import { Terms } from "./screens/Terms";
import { Event } from "./screens/Event";
import { Dashboard } from "./screens/Dashboard";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { useAuthStore } from "./store/authStore";

// Initialize auth state before rendering
useAuthStore.getState().initAuth();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error(
    'Missing VITE_GOOGLE_CLIENT_ID environment variable. ' +
    'Please ensure you have set up your .env file with a valid Google OAuth client ID.'
  );
}

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/event/:id" element={<Event />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);