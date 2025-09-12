import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { opportunitiesAPI } from '../services/api';
import OpportunityForm from '../components/opportunities/OpportunityForm';

const CreateOpportunity = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            // Add coordinates (for now, we'll use a placeholder)
            const dataWithCoords = {
                ...formData,
                location: {
                    ...formData.location,
                    coordinates: {
                        type: 'Point',
                        coordinates: [-74.006, 40.7128] // Default to NYC coordinates
                    }
                }
            };

            await opportunitiesAPI.create(dataWithCoords);
            navigate('/my-opportunities');
        } catch (error) {
            console.error('Error creating opportunity:', error);
            setError(error.response?.data?.message || 'Failed to create opportunity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold">Create New Opportunity</h1>
                        <p className="text-primary-100 mt-2">
                            Post a new volunteer opportunity for volunteers to discover
                        </p>
                    </div>

                    <div className="p-6">
                        <OpportunityForm
                            onSubmit={handleSubmit}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOpportunity;