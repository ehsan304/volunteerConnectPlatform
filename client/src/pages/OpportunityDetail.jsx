import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, ArrowLeft, Heart, Share, AlertCircle } from 'lucide-react';
import { opportunitiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OpportunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const userRole = user?.role || null;
    // console.log('user:', user);          // will show {_id, email, role}
    // console.log('userRole:', userRole);
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    // const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchOpportunity();
    }, [id]);

    // useEffect(() => {
    //     // Update userRole when user changes
    //     if (user) {
    //         userRole(user.role);
    //     } else {
    //         userRole(null);
    //     }
    // }, [user]);
    // console.log('user:', user);
    // console.log('userRole:', userRole);


    const fetchOpportunity = async () => {
        try {
            setLoading(true);
            const response = await opportunitiesAPI.getOne(id);
            setOpportunity(response.data.data);
            setError(null);

            // Check if user has already applied (if authenticated)
            if (isAuthenticated && user && user.role === 'volunteer') {
                checkApplicationStatus(response.data);
            }
        } catch (error) {
            console.error('Error fetching opportunity:', error);
            setError('Failed to load opportunity. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const checkApplicationStatus = (opp) => {
        const hasApplied = opp.volunteersRegistered?.some(volunteer =>
            volunteer._id === user._id || volunteer === user._id
        );
        setApplicationStatus(hasApplied ? 'applied' : 'not_applied');
    };

    const handleApply = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/opportunities/${id}` } });
            return;
        }

        // Check if user role is available and is volunteer
        if (userRole !== 'volunteer') {
            setError('Only volunteers can apply to opportunities');
            return;
        }

        try {
            setApplying(true);
            // This would be replaced with actual application API call
            // For now, we'll simulate success
            setTimeout(() => {
                setApplicationStatus('applied');
                setApplying(false);
                // Update local state to reflect the application
                setOpportunity(prev => ({
                    ...prev,
                    volunteersRegistered: [...(prev.volunteersRegistered || []), user._id]
                }));
            }, 1000);
        } catch (error) {
            console.error('Error applying to opportunity:', error);
            setError('Failed to apply. Please try again.');
            setApplying(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" />
            </div>
        );
    }
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getTimeRange = (time) => {
        if (!time.start && !time.end) return 'Flexible timing';
        return `${time.start || ''} - ${time.end || ''}`;
    };

    const calculateSpotsLeft = () => {
        const registered = opportunity?.volunteersRegistered?.length || 0;
        return Math.max(0, (opportunity?.volunteersNeeded || 0) - registered);
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
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600 mb-4">{error || 'Opportunity not found'}</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={fetchOpportunity}
                                className="btn-primary"
                            >
                                Try Again
                            </button>
                            <Link
                                to="/opportunities"
                                className="btn-secondary"
                            >
                                Browse Opportunities
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Opportunities
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
                                <p className="text-primary-100">Posted by {opportunity.organizer?.email || 'Organization'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Share className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <MapPin className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-semibold">{opportunity.location.city}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <Calendar className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-semibold">{formatDate(opportunity.date)}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <Clock className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Time</p>
                                <p className="font-semibold">{getTimeRange(opportunity.time)}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Volunteers</p>
                                <p className="font-semibold">{calculateSpotsLeft()} spots left</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">About this Opportunity</h2>
                            <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
                        </div>

                        {/* Location Details */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">{opportunity.location.address}</p>
                                <p className="text-gray-600">{opportunity.location.city}, {opportunity.location.zipCode}</p>
                            </div>
                        </div>

                        {/* Skills Required */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills Required</h2>
                            <div className="flex flex-wrap gap-2">
                                {opportunity.requiredSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t pt-6">
                            {applicationStatus === 'applied' ? (
                                <div className="text-center">
                                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">
                                        <p className="font-medium">You've successfully applied to this opportunity!</p>
                                        <p>The organizer will contact you with more details.</p>
                                    </div>
                                    <Link
                                        to="/opportunities"
                                        className="btn-primary"
                                    >
                                        Browse More Opportunities
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleApply}
                                        disabled={applying || calculateSpotsLeft() === 0 || (isAuthenticated && userRole !== 'volunteer')}
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {applying ? (
                                            <>
                                                <LoadingSpinner size="small" />
                                                <span className="ml-2">Applying...</span>
                                            </>
                                        ) : isAuthenticated && userRole !== 'volunteer' ? (
                                            'Only volunteers can apply'
                                        ) : (
                                            `Apply Now (${calculateSpotsLeft()} spots left)`
                                        )}
                                    </button>

                                    {calculateSpotsLeft() === 0 && (
                                        <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg">
                                            <p>This opportunity is currently full. Check back later for openings.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Additional Info for Organizers */}
                        {isAuthenticated && userRole === 'organizer' && user._id === opportunity.organizer?._id && (
                            <div className="mt-6 border-t pt-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Organizer Tools</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button className="btn-secondary">
                                        Edit Opportunity
                                    </button>
                                    <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                                        Delete Opportunity
                                    </button>
                                </div>

                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">Registered Volunteers</h3>
                                    {opportunity.volunteersRegistered?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {opportunity.volunteersRegistered.map((volunteer, index) => (
                                                <li key={index} className="text-gray-600">
                                                    {typeof volunteer === 'object' ? volunteer.email : 'Volunteer #' + (index + 1)}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600">No volunteers have applied yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Opportunities */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Opportunities</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* This would be populated with actual related opportunities */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-semibold text-gray-800 mb-2">Community Garden Volunteer</h3>
                            <p className="text-gray-600 text-sm mb-3">Help maintain our community garden every Saturday morning</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>Same location</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-semibold text-gray-800 mb-2">Food Distribution Assistant</h3>
                            <p className="text-gray-600 text-sm mb-3">Help distribute food to those in need at our weekly food bank</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Same date</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetail;