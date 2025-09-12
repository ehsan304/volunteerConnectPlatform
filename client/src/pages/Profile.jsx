import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import ProfileForm from '../components/profile/ProfileForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
    const { user } = useAuth();
    const { profile, loading, error, fetchProfile, clearErrors } = useProfile();
    const navigate = useNavigate();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        // Clear errors when component unmounts
        return () => {
            clearErrors();
        };
    }, [clearErrors]);

    useEffect(() => {
        if (user?.role === 'organizer') {
            navigate('/my-opportunities', { replace: true });
            return;
        }

        if (user?.role === 'volunteer' && !hasFetched) {
            setHasFetched(true);
            fetchProfile();
        }
    }, [user, navigate, fetchProfile, hasFetched]);

    // Show loading spinner while determining user role or fetching profile
    if (!user || (user?.role === 'volunteer' && loading && !profile)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    // Redirect organizers (should already happen in useEffect, but this is a fallback)
    if (user?.role === 'organizer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    // Show error state if something went wrong
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={() => {
                                    clearErrors();
                                    setHasFetched(false);
                                }}
                                className="btn-primary"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8">
                        <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                        <p className="text-primary-100 mt-2">
                            Manage your volunteer profile and preferences
                        </p>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <ProfileForm profile={profile} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;