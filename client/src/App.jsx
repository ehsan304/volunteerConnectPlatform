import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredRole="volunteer">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                {/* Add more routes as we create more pages */}
              </Routes>
            </main>
          </div>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;