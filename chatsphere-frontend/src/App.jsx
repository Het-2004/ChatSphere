import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ProtectedRoute from "./auth/ProtectedRoute";
import ChatLayout from "./components/layout/ChatLayout";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
