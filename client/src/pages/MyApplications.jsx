import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Check, X, AlertCircle, FileText } from 'lucide-react';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await applicationsAPI.getMyApplications();
            setApplications(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError('Failed to load your applications');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <Check className="h-5 w-5 text-green-600" />;
            case 'rejected':
                return <X className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-600" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Pending';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(app => app.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-gray-600 mt-2">
                        Track the status of your volunteer opportunity applications
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-gray-800">{applications.length}</div>
                        <div className="text-sm text-gray-600">Total Applications</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-yellow-600">
                            {applications.filter(app => app.status === 'pending').length}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-green-600">
                            {applications.filter(app => app.status === 'approved').length}
                        </div>
                        <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-red-600">
                            {applications.filter(app => app.status === 'rejected').length}
                        </div>
                        <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        All Applications
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'approved'
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'rejected'
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Rejected
                    </button>
                </div>

                {/* Applications List */}
                {filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        {applications.length === 0 ? (
                            <>
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications yet</h3>
                                <p className="text-gray-600 mb-4">
                                    You haven't applied to any volunteer opportunities yet.
                                </p>
                                <Link to="/opportunities" className="btn-primary">
                                    Browse Opportunities
                                </Link>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No {filter} applications</h3>
                                <p className="text-gray-600">
                                    You don't have any {filter} applications at the moment.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((application) => (
                            <div key={application._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                {application.opportunity?.title}
                                            </h3>
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>{application.opportunity?.location?.city}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>{formatDate(application.opportunity?.date)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                {getStatusIcon(application.status)}
                                                <span className="ml-2">{getStatusText(application.status)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-800 mb-2">Application Details</h4>
                                        <p className="text-gray-600 mb-2">
                                            <strong>Applied on:</strong> {formatDate(application.appliedAt)}
                                        </p>
                                        {application.message && (
                                            <div className="mt-2">
                                                <p className="font-medium text-gray-800 mb-1">Your message:</p>
                                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                    {application.message}
                                                </p>
                                            </div>
                                        )}

                                        {application.status === 'approved' && (
                                            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                                <p className="font-medium">Your application has been approved!</p>
                                                <p className="text-sm mt-1">
                                                    The organizer will contact you with more details about the opportunity.
                                                </p>
                                            </div>
                                        )}

                                        {application.status === 'rejected' && (
                                            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                                <p className="font-medium">Your application was not approved.</p>
                                                <p className="text-sm mt-1">
                                                    Don't worry! There are plenty of other opportunities waiting for you.
                                                </p>
                                            </div>
                                        )}

                                        {application.status === 'pending' && (
                                            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                                                <p className="font-medium">Your application is under review.</p>
                                                <p className="text-sm mt-1">
                                                    The organizer will review your application and notify you of their decision.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <Link
                                            to={`/opportunities/${application.opportunity?._id}`}
                                            className="text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            View Opportunity Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;