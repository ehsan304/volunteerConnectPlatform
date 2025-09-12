// src/components/common/RoleGuard.jsx
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleGuard = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (user?.role !== requiredRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 text-center">
                        This page is for {requiredRole}s only.
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

export default RoleGuard;