import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MapPin, Check, X, Clock } from 'lucide-react';
import { applicationsAPI, opportunitiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ApplicationsManagement = () => {
    const { opportunityId } = useParams();
    const { user } = useAuth();
    const [opportunity, setOpportunity] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [opportunityId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch opportunity details
            const opportunityResponse = await opportunitiesAPI.get(opportunityId);
            setOpportunity(opportunityResponse.data);

            // Verify current user is the organizer
            if (opportunityResponse.data.organizer._id !== user._id) {
                setError('You are not authorized to view these applications');
                return;
            }

            // Fetch applications
            const applicationsResponse = await applicationsAPI.getOpportunityApplications(opportunityId);
            setApplications(applicationsResponse.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            setUpdating(applicationId);

            await applicationsAPI.updateStatus(applicationId, status);

            // Update local state
            setApplications(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status } : app
            ));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update application');
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
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
                        <Link to="/my-opportunities" className="btn-primary">
                            Back to My Opportunities
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        to="/my-opportunities"
                        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to My Opportunities
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 text-white">
                        <h1 className="text-2xl font-bold">Applications for {opportunity.title}</h1>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total Applications</p>
                                <p className="text-2xl font-bold">{applications.length}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Volunteers Needed</p>
                                <p className="text-2xl font-bold">{opportunity.volunteersNeeded}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('pending')}`}>
                                Pending: {applications.filter(app => app.status === 'pending').length}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('approved')}`}>
                                Approved: {applications.filter(app => app.status === 'approved').length}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('rejected')}`}>
                                Rejected: {applications.filter(app => app.status === 'rejected').length}
                            </span>
                        </div>
                    </div>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications yet</h3>
                        <p className="text-gray-600">Volunteers haven't applied to this opportunity yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Volunteer</th>
                                        <th className="text-left py-3 px-4">Applied</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                        <th className="text-left py-3 px-4">Message</th>
                                        <th className="text-left py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((application) => (
                                        <tr key={application._id} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center">
                                                    <User className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span>{application.volunteer?.email || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {new Date(application.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                                                    {application.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                                    {application.message || 'No message provided'}
                                                </p>
                                            </td>
                                            <td className="py-4 px-4">
                                                {application.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(application._id, 'approved')}
                                                            disabled={updating === application._id}
                                                            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            {updating === application._id ? (
                                                                <LoadingSpinner size="small" />
                                                            ) : (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                                            disabled={updating === application._id}
                                                            className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationsManagement;