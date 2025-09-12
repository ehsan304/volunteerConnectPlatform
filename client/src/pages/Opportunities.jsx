// src/pages/Opportunities.jsx
import { useEffect } from 'react';
import { useOpportunities } from '../contexts/OpportunityContext';
import OpportunityFilters from '../components/opportunities/OpportunityFilters';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Frown, Search } from 'lucide-react';

const Opportunities = () => {
    const { opportunities, filteredOpportunities, loading, error, fetchOpportunities } = useOpportunities();

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner size="large" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg max-w-md mx-auto">
                            <p className="font-medium">Error loading opportunities</p>
                            <p>{error}</p>
                        </div>
                        <button
                            onClick={fetchOpportunities}
                            className="btn-primary mt-4"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Volunteer Opportunities
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover meaningful volunteer opportunities that match your skills and interests
                    </p>
                </div>

                {/* Filters */}
                <OpportunityFilters />

                {/* Results Count */}
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-600">
                        Showing {filteredOpportunities.length} of {opportunities.length} opportunities
                    </p>
                </div>

                {/* Opportunities Grid */}
                {filteredOpportunities.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredOpportunities.map((opportunity) => (
                            <OpportunityCard
                                key={opportunity._id}
                                opportunity={opportunity}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md animate-fade-in">
                        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No opportunities found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or check back later for new opportunities.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            Refresh Opportunities
                        </button>
                    </div>
                )}

                {/* Load More Button (for future pagination) */}
                {filteredOpportunities.length > 0 && (
                    <div className="text-center mt-8">
                        <button className="btn-secondary">
                            Load More Opportunities
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Opportunities;