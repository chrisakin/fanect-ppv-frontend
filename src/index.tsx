import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Home } from "./screens/Home";
import { AboutUs } from "./screens/AboutUs";
import { PrivacyPolicy } from "./screens/PrivacyPolicy";
import { Terms } from "./screens/Terms";
import { Event } from "./screens/Event";
import { Dashboard } from "./screens/Dashboard";
import { Search } from "./screens/Search";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { useAuthStore } from "./store/authStore";
import { PaymentSuccess } from "./screens/PaymentSuccess/PaymentSuccess";
import { NotFound } from "./screens/NotFound";
import { useFCM } from "./hooks/useFCM";
import { LocationProvider } from "./components/LocationProvider";
import { PasswordReset } from "./screens/PasswordReset";
import { setRedirectNavigate } from "./services/redirectService";

// Initialize auth state before rendering
useAuthStore.getState().initAuth();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error(
    'Missing VITE_GOOGLE_CLIENT_ID environment variable. ' +
    'Please ensure you have set up your .env file with a valid Google OAuth client ID.'
  );
}

function App() {
  // Only initialize FCM if Firebase is properly configured
  const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                           import.meta.env.VITE_FIREBASE_PROJECT_ID;
  
  if (hasFirebaseConfig) {
    useFCM();
  }
  const navigate = useNavigate();

  useEffect(() => {
    setRedirectNavigate(navigate);
  }, [navigate]);
  
  return (
    <LocationProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/search" element={<Search />} />
        <Route path="/:method/payment-success" element={<PaymentSuccess />} />
        <Route path="/reset/:token" element={<PasswordReset />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LocationProvider>
  );
}

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <Router>
        <App />
        </Router>
        <Toaster />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);