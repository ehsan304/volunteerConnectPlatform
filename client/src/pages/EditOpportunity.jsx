import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { opportunitiesAPI } from '../services/api';
import OpportunityForm from '../components/opportunities/OpportunityForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditOpportunity = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOpportunity();
    }, [id]);

    const fetchOpportunity = async () => {
        try {
            setLoading(true);
            const response = await opportunitiesAPI.getOne(id);
            const opportunityData = response.data.data;
            // Check if the current user is the organizer
            if (opportunityData.organizer._id !== user._id) {
            navigate('/my-opportunities');
            return;
        }

            setOpportunity(response.data);
        } catch (error) {
            console.error('Error fetching opportunity:', error);
            setError('Failed to load opportunity');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setUpdating(true);
            setError(null);

            await opportunitiesAPI.update(id, formData);
            navigate('/my-opportunities');
        } catch (error) {
            console.error('Error updating opportunity:', error);
            setError(error.response?.data?.message || 'Failed to update opportunity');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error || !opportunity) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md p-6 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600 mb-4">{error || 'Opportunity not found'}</p>
                        <button
                            onClick={() => navigate('/my-opportunities')}
                            className="btn-primary"
                        >
                            Back to My Opportunities
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to My Opportunities
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold">Edit Opportunity</h1>
                        <p className="text-primary-100 mt-2">
                            Update your volunteer opportunity details
                        </p>
                    </div>

                    <div className="p-6">
                        <OpportunityForm
                            opportunity={opportunity}
                            onSubmit={handleSubmit}
                            loading={updating}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOpportunity;