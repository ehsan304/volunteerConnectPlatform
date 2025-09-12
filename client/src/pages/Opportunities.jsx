import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Clock, Filter, Search, X } from 'lucide-react';
import { opportunitiesAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        skills: [],
        city: '',
        date: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    useEffect(() => {
        filterOpportunities();
    }, [opportunities, searchTerm, filters]);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const response = await opportunitiesAPI.getAll();
            setOpportunities(response.data.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            setError('Failed to load opportunities. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filterOpportunities = () => {
        let filtered = [...opportunities];

        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter(opportunity =>
                opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opportunity.location.city.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply skills filter
        if (filters.skills.length > 0) {
            filtered = filtered.filter(opportunity =>
                filters.skills.every(skill =>
                    opportunity.requiredSkills.some(oppSkill =>
                        oppSkill.toLowerCase().includes(skill.toLowerCase())
                    )
                )
            );
        }

        // Apply city filter
        if (filters.city) {
            filtered = filtered.filter(opportunity =>
                opportunity.location.city.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        // Apply date filter
        if (filters.date) {
            const filterDate = new Date(filters.date);
            filtered = filtered.filter(opportunity => {
                const opportunityDate = new Date(opportunity.date);
                return opportunityDate.toDateString() === filterDate.toDateString();
            });
        }

        setFilteredOpportunities(filtered);
    };

    const handleSkillFilter = (skill) => {
        setFilters(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            skills: [],
            city: '',
            date: ''
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getTimeRange = (time) => {
        if (!time.start && !time.end) return '';
        return `${time.start || ''} - ${time.end || ''}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md p-6 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchOpportunities}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Volunteer Opportunities</h1>
                    <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                        Discover meaningful ways to contribute to your community and make a difference
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search opportunities by title, description, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="h-5 w-5" />
                            Filters
                            {(filters.skills.length > 0 || filters.city || filters.date) && (
                                <span className="bg-primary-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                    {filters.skills.length + (filters.city ? 1 : 0) + (filters.date ? 1 : 0)}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="bg-white p-4 rounded-lg shadow-md mb-4 animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">Filters</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        placeholder="Filter by city"
                                        value={filters.city}
                                        onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={filters.date}
                                        onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Teaching', 'Gardening', 'First Aid', 'Cooking', 'IT Support'].map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => handleSkillFilter(skill)}
                                                className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.skills.includes(skill)
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">
                            {filteredOpportunities.length} opportunity{filteredOpportunities.length !== 1 ? 'ies' : ''} found
                        </p>
                        {(searchTerm || filters.skills.length > 0 || filters.city || filters.date) && (
                            <button
                                onClick={clearFilters}
                                className="text-primary-600 hover:text-primary-700 text-sm"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Opportunities Grid */}
                {filteredOpportunities.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No opportunities found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search or filters to find more opportunities.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="btn-primary"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOpportunities.map((opportunity) => (
                            <div
                                key={opportunity._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {opportunity.title}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {opportunity.description}
                                    </p>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                                            <span>{opportunity.location.city}, {opportunity.location.zipCode}</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                                            <span>{formatDate(opportunity.date)}</span>
                                        </div>

                                        {opportunity.time && (
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-2 text-primary-600" />
                                                <span>{getTimeRange(opportunity.time)}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-primary-600" />
                                            <span>
                                                {opportunity.volunteersRegistered?.length || 0} of {opportunity.volunteersNeeded} volunteers
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {opportunity.requiredSkills.slice(0, 4).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {opportunity.requiredSkills.length > 4 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    +{opportunity.requiredSkills.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button className="w-full btn-primary">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Opportunities;