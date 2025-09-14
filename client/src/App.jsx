import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OpportunityDetail from './pages/OpportunityDetail';
import Opportunities from './pages/Opportunities';
import CreateOpportunity from './pages/CreateOpportunity';
import EditOpportunity from './pages/EditOpportunity';
import ApplicationsManagement from './pages/ApplicationsManagement';
import MyApplications from './pages/MyApplications';
import MatchingResults from './pages/MatchingResults';
import NotFound from './components/common/NotFound';
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
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/opportunities/:id" element={<OpportunityDetail />} />

                {/* Volunteer-only routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredRole="volunteer">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-applications"
                  element={
                    <ProtectedRoute requiredRole="volunteer">
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/matches"
                  element={
                    <ProtectedRoute requiredRole="volunteer">
                      <MatchingResults />
                    </ProtectedRoute>
                  }
                />

                {/* Organizer-only routes */}
                <Route
                  path="/my-opportunities"
                  element={
                    <ProtectedRoute requiredRole="organizer">
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/opportunities/create"
                  element={
                    <ProtectedRoute requiredRole="organizer">
                      <CreateOpportunity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/opportunities/:id/edit"
                  element={
                    <ProtectedRoute requiredRole="organizer">
                      <EditOpportunity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/opportunities/:opportunityId/applications"
                  element={
                    <ProtectedRoute requiredRole="organizer">
                      <ApplicationsManagement />
                    </ProtectedRoute>
                  }
                />

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;