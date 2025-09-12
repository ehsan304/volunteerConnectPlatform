import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useOpportunities } from '../../contexts/OpportunityContext';

const OpportunityFilters = () => {
    const { filters, setFilters, clearFilters } = useOpportunities();
    const [localFilters, setLocalFilters] = useState(filters);
    const [showFilters, setShowFilters] = useState(false);

    const commonSkills = [
        'Teaching',
        'Mentoring',
        'First Aid',
        'Gardening',
        'Cooking',
        'Cleaning',
        'Construction',
        'IT Support',
        'Administration'
    ];

    const handleApplyFilters = () => {
        setFilters(localFilters);
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setLocalFilters({
            skills: [],
            location: '',
            dateRange: {
                start: '',
                end: ''
            }
        });
        clearFilters();
    };

    const handleSkillToggle = (skill) => {
        setLocalFilters(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const hasActiveFilters = filters.skills.length > 0 || filters.location || filters.dateRange.start || filters.dateRange.end;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by location, skills, or keywords..."
                        value={localFilters.location}
                        onChange={(e) => setLocalFilters(prev => ({
                            ...prev,
                            location: e.target.value
                        }))}
                        className="input-field pl-10"
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary flex items-center"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {filters.skills.length + (filters.location ? 1 : 0) + (filters.dateRange.start || filters.dateRange.end ? 1 : 0)}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="btn-primary flex items-center bg-gray-600 hover:bg-gray-700"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </button>
                )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="border-t pt-4 space-y-4 animate-slide-in">
                    {/* Skills Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skills
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {commonSkills.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => handleSkillToggle(skill)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors ${localFilters.skills.includes(skill)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={localFilters.dateRange.start}
                                onChange={(e) => setLocalFilters(prev => ({
                                    ...prev,
                                    dateRange: { ...prev.dateRange, start: e.target.value }
                                }))}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={localFilters.dateRange.end}
                                onChange={(e) => setLocalFilters(prev => ({
                                    ...prev,
                                    dateRange: { ...prev.dateRange, end: e.target.value }
                                }))}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Apply/Cancel Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowFilters(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApplyFilters}
                            className="btn-primary"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && !showFilters && (
                <div className="border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                        {filters.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                            >
                                {skill}
                                <button
                                    onClick={() => setFilters(prev => ({
                                        ...prev,
                                        skills: prev.skills.filter(s => s !== skill)
                                    }))}
                                    className="ml-2 text-primary-600 hover:text-primary-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        {filters.location && (
                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                Location: {filters.location}
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {(filters.dateRange.start || filters.dateRange.end) && (
                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                Date: {filters.dateRange.start} to {filters.dateRange.end}
                                <button
                                    onClick={() => setFilters(prev => ({
                                        ...prev,
                                        dateRange: { start: '', end: '' }
                                    }))}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpportunityFilters;