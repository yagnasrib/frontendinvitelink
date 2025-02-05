import { BrowserRouter as Router, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import Register from "./layout/Registration";
import Login from "./layout/Login";
import ChatApp from "./layout/chatApp";
import VerifyEmail from "./components/verifyEmail";
import Invite from "./layout/Invitebutton";

function Home() {
  return (
    <div className="bg-white p-64 rounded-lg shadow-inner text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Welcome to the App!</h2>
      <p className="text-lg text-gray-600 mt-4">
        Please <a href="/login" className="text-blue-500 hover:underline">login</a> or{' '}
        <a href="/register" className="text-blue-500 hover:underline">register</a>.
      </p>
    </div>
  );
}

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

// 🔴 Fixing Invite Link Handling
const RegisterWithInvite = () => {
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("invite");

  if (!inviteId) {
    return <div>Invalid or Expired Invite Link.</div>;
  }

  return <Register inviteId={inviteId} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterWithInvite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/chat" element={<ProtectedRoute element={<ChatApp />} />} />
      </Routes>
    </Router>
  );
}

export default App;
