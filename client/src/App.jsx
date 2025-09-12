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
import OrganizerDashboard from './pages/OrganizerDashboard';
import OpportunityDetail from './pages/OpportunityDetail';
import Opportunities from './pages/Opportunities';
import CreateOpportunity from './pages/CreateOpportunity';
import EditOpportunity from './pages/EditOpportunity';
import ApplicationsManagement from './pages/ApplicationsManagement';
import MyApplications from './pages/MyApplications';



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
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-opportunities"
                  element={
                    <ProtectedRoute
                    // requiredRole="organizer"
                    >
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/opportunities" element={<Opportunities />} /> 
                <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                <Route
                  path="/opportunities/create"
                  element={
                    <ProtectedRoute
                    // requiredRole="organizer"
                    >
                      <CreateOpportunity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/opportunities/:id/edit"
                  element={
                    <ProtectedRoute
                    // requiredRole="organizer"
                    >
                      <EditOpportunity />
                    </ProtectedRoute>
                  }
                />
                

                // Add these routes
                <Route
                  path="/opportunities/:opportunityId/applications"
                  element={
                    <ProtectedRoute 
                    // requiredRole="organizer"
                    >
                      <ApplicationsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-applications"
                  element={
                    <ProtectedRoute 
                    // requiredRole="volunteer"
                    >
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;



