import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import AnalystDashboard from "./components/AnalystDashboard";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/analystdashboard" element={<AnalystDashboard />} />
            {/* Redirect any unknown route to landing page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
