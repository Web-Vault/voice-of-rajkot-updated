import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireAuth from "./components/RequireAuth";
import AppNavbar from "./components/AppNavbar";
import AppHome from "./pages/common/AppHome";
import AppEvents from "./pages/common/AppEvents";
import AppPosts from "./pages/common/AppPosts";
import ArtistList from "./pages/common/ArtistList";
import UserProfile from "./pages/common/UserProfile";
import MyProfile from "./pages/common/MyProfile";
import NotFound from "./pages/NotFound";
import AppFooter from "./components/AppFooter";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";
import Onboarding from "./pages/auth/Onboarding";
import EmailVerification from "./pages/auth/EmailVerification";
import EventDetails from "./pages/common/EventDetails";
import TicketRegistration from "./pages/common/TicketRegistration";
import ArtistProfile from "./pages/artist/ArtistProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContactUs from "./pages/contactUs";
import PrivacyPolicy from "./pages/privacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ShippingPolicy from "./pages/ShippingPolicy";

function AppRoutes() {
  const location = useLocation();
  // const isArtistDashboard = location.pathname.startsWith("/artist/");
  const hideNavbar = location.pathname.startsWith("/register")
    || ["/login", "/onboarding", "/email-verification"].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <AppNavbar />}
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/events" element={<AppEvents />} />
        <Route path="/posts" element={<AppPosts />} />
        <Route path="/artists" element={<ArtistList />} />
        <Route path="/artist/:id" element={<UserProfile />} />
        <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/register" element={<AuthRegister />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/register/:type/:id" element={<TicketRegistration />} />

        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policies" element={<RefundPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        {/* Artist pages */}
        {/* <Route path="/artist/home" element={<ProtectedRoute requiresPerformer={true}><ArtistHome /></ProtectedRoute>} /> */}
        <Route path="/artist/profile" element={<ProtectedRoute requiresPerformer={true}><ArtistProfile /></ProtectedRoute>} />
        {/* Admin pages */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requiresAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        {/* Add more routes for other pages here */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNavbar && <AppFooter />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RequireAuth>
          <AppRoutes />
        </RequireAuth>
      </Router>
    </AuthProvider>
  );
}

export default App;
