import { Amplify } from "aws-amplify";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import awsmobile from "./aws-export";
import DashboardPage from "./pages/dashboard";
import GDPRPage from "./pages/gdpr";
import LandingPage from "./pages/home";
import LoginPage from "./pages/login";
import PostsPage from "./pages/posts";
import PrivacyPolicyPage from "./pages/privacy-policy";
import TermsPage from "./pages/terms";
import RegisterPage from "./pages/register";

Amplify.configure(awsmobile, { ssr: true });

function App() {
  return (
    // <UserProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/gdpr" element={<GDPRPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </Router>
    // </UserProvider>
  );
}

export default App;
