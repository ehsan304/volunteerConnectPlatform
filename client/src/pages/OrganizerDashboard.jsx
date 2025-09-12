import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, Eye } from 'lucide-react';
import { opportunitiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrganizerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const response = await opportunitiesAPI.getMy();
            setOpportunities(response.data.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            setError('Failed to load your opportunities');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this opportunity?')) return;

        try {
            setDeletingId(id);
            await opportunitiesAPI.delete(id);
            setOpportunities(prev => prev.filter(opp => opp._id !== id));
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            setError('Failed to delete opportunity');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatus = (opportunity) => {
        const now = new Date();
        const opportunityDate = new Date(opportunity.date);

        if (opportunityDate < now) {
            return { text: 'Completed', color: 'bg-gray-100 text-gray-800' };
        }

        const registered = opportunity.volunteersRegistered?.length || 0;
        if (registered >= opportunity.volunteersNeeded) {
            return { text: 'Full', color: 'bg-green-100 text-green-800' };
        }

        return { text: 'Open', color: 'bg-blue-100 text-blue-800' };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your volunteer opportunities and applications
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-6 w-6 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Opportunity</h3>
                        <p className="text-gray-600 mb-4">
                            Post a new volunteer opportunity for volunteers to discover
                        </p>
                        <Link
                            to="/opportunities/create"
                            className="btn-primary inline-block w-full"
                        >
                            Create New
                        </Link>
                    </div>

                    <div className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Eye className="h-6 w-6 text-secondary-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">View Opportunities</h3>
                        <p className="text-gray-600 mb-4">
                            Browse all available volunteer opportunities on the platform
                        </p>
                        <Link
                            to="/opportunities"
                            className="btn-secondary inline-block w-full"
                        >
                            Browse All
                        </Link>
                    </div>

                    <div className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Applications</h3>
                        <p className="text-gray-600 mb-4">
                            Review and manage volunteer applications for your opportunities
                        </p>
                        <button
                            disabled
                            className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-medium w-full cursor-not-allowed"
                        >
                            Coming Soon
                        </button>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Your Opportunities</h2>
                        <span className="text-sm text-gray-600">
                            {opportunities.length} opportunity{opportunities.length !== 1 ? 'ies' : ''}
                        </span>
                    </div>

                    {opportunities.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">You haven't created any opportunities yet.</p>
                            <Link to="/opportunities/create" className="btn-primary">
                                Create Your First Opportunity
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Title</th>
                                        <th className="text-left py-3 px-4">Date</th>
                                        <th className="text-left py-3 px-4">Location</th>
                                        <th className="text-left py-3 px-4">Volunteers</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                        <th className="text-left py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {opportunities.map((opportunity) => {
                                        const status = getStatus(opportunity);
                                        return (
                                            <tr key={opportunity._id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <Link
                                                        to={`/opportunities/${opportunity._id}`}
                                                        className="font-medium text-primary-600 hover:text-primary-700"
                                                    >
                                                        {opportunity.title}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-4">{formatDate(opportunity.date)}</td>
                                                <td className="py-4 px-4">{opportunity.location.city}</td>
                                                <td className="py-4 px-4">
                                                    {opportunity.volunteersRegistered?.length || 0} / {opportunity.volunteersNeeded}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            to={`/opportunities/${opportunity._id}/applications`}
                                                            className="p-1 text-gray-600 hover:text-primary-600"
                                                            title="View Applications"
                                                        >
                                                            <Users className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            to={`/opportunities/${opportunity._id}/edit`}
                                                            className="p-1 text-blue-600 hover:text-blue-700"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(opportunity._id)}
                                                            disabled={deletingId === opportunity._id}
                                                            className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            {deletingId === opportunity._id ? (
                                                                <LoadingSpinner size="small" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 card p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{opportunities.length}</div>
                            <div className="text-sm text-gray-600">Total Opportunities</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {opportunities.reduce((total, opp) => total + (opp.volunteersRegistered?.length || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Applications</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {opportunities.reduce((total, opp) => total + opp.volunteersNeeded, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Volunteers Needed</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {opportunities.filter(opp => new Date(opp.date) > new Date()).length}
                            </div>
                            <div className="text-sm text-gray-600">Upcoming Events</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
