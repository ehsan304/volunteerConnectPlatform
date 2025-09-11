import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import ProfileForm from '../components/profile/ProfileForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
    const { user } = useAuth();
    const { profile, loading, error, fetchProfile, clearErrors } = useProfile();

    useEffect(() => {
        if (user?.role === 'volunteer') {
            fetchProfile();
        }
        return () => clearErrors();
    }, [user, fetchProfile, clearErrors]);

    if (user?.role !== 'volunteer') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 text-center">
                        Only volunteers can access profile management.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
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