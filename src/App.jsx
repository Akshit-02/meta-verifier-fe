import { Amplify } from "aws-amplify";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import awsmobile from "./aws-export";
import CommentAutomationPage from "./pages/comment-automation";
import ContentPostingPage from "./pages/content-posting";
import DashboardPage from "./pages/dashboard";
import DMAutomationPage from "./pages/dm-automation";
import GDPRPage from "./pages/gdpr";
import LandingPage from "./pages/home";
import InstagramMessagesPage from "./pages/inbox";
import LoginPage from "./pages/login";
import PostsPage from "./pages/posts";
import PrivacyPolicyPage from "./pages/privacy-policy";
import RegisterPage from "./pages/register";
import TermsPage from "./pages/terms";
import ContentSchedulingPage from "./pages/content-scheduling";
import ConnectSocialPage from "./pages/connect-social";

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
        <Route path="/connect-social" element={<ConnectSocialPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/content-posting" element={<ContentPostingPage />} />
        <Route path="/content-scheduling" element={<ContentSchedulingPage />} />
        <Route path="/comment-automation" element={<CommentAutomationPage />} />
        <Route path="/dm-automation" element={<DMAutomationPage />} />
        <Route path="/inbox" element={<InstagramMessagesPage />} />
      </Routes>
    </Router>
    // </UserProvider>
  );
}

export default App;
