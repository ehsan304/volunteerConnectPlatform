// src/pages/OrganizerDashboard.jsx
import { Link } from 'react-router-dom';
import { Plus, Edit, Users } from 'lucide-react';

const OrganizerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your volunteer opportunities and applications
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
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
                            <Edit className="h-6 w-6 text-secondary-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Opportunities</h3>
                        <p className="text-gray-600 mb-4">
                            View and edit your existing volunteer opportunities
                        </p>
                        <Link
                            to="/my-opportunities"
                            className="btn-secondary inline-block w-full"
                        >
                            View All
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

                <div className="mt-12 card p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">5</div>
                            <div className="text-sm text-gray-600">Active Opportunities</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">23</div>
                            <div className="text-sm text-gray-600">Total Applications</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">12</div>
                            <div className="text-sm text-gray-600">Volunteers Needed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;