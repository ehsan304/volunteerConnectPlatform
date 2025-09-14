
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { MapPin, Calendar, Users, Star, ArrowLeft, Filter } from 'lucide-react';
// import { matchingAPI } from '../services/api';
// import { useAuth } from '../contexts/AuthContext';
// import LoadingSpinner from '../components/common/LoadingSpinner';

// const MatchingResults = () => {
//     const { user } = useAuth();
//     const [matches, setMatches] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [sortBy, setSortBy] = useState('overall');
//     const [filterSkill, setFilterSkill] = useState('all');

//     useEffect(() => {
//         fetchMatches();
//     }, []);

//     const fetchMatches = async () => {
//         try {
//             setLoading(true);
//             const response = await matchingAPI.getMatches();

//             // Ensure response.data is always an array
//             const data = Array.isArray(response.data) ? response.data : [];
//             setMatches(data);
//             setError(null);
//         } catch (error) {
//             console.error('Error fetching matches:', error);
//             setError('Failed to load matched opportunities');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getSkillMatchColor = (score) => {
//         if (score >= 80) return 'text-green-600';
//         if (score >= 60) return 'text-yellow-600';
//         return 'text-red-600';
//     };

//     const getDistanceText = (distance) => {
//         if (!distance) return 'Distance not available';
//         return `${distance} miles away`;
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     const getUniqueSkills = () => {
//         const safeMatches = Array.isArray(matches) ? matches : [];
//         const allSkills = safeMatches.flatMap(match =>
//             Array.isArray(match.opportunity?.requiredSkills)
//                 ? match.opportunity.requiredSkills
//                 : []
//         );
//         return ['all', ...new Set(allSkills)].filter(Boolean);
//     };

//     const safeMatches = Array.isArray(matches) ? matches : [];

//     const filteredAndSortedMatches = safeMatches
//         .filter(match => {
//             if (filterSkill === 'all') return true;
//             return Array.isArray(match.opportunity?.requiredSkills) &&
//                 match.opportunity.requiredSkills.includes(filterSkill);
//         })
//         .sort((a, b) => {
//             if (sortBy === 'skills') {
//                 return (b.matchScore?.skills || 0) - (a.matchScore?.skills || 0);
//             } else if (sortBy === 'distance') {
//                 return (a.matchScore?.distance ?? Infinity) - (b.matchScore?.distance ?? Infinity);
//             }
//             return (b.matchScore?.overall || 0) - (a.matchScore?.overall || 0);
//         });

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <LoadingSpinner size="large" />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="mb-6">
//                     <Link
//                         to="/opportunities"
//                         className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
//                     >
//                         <ArrowLeft className="h-5 w-5 mr-2" />
//                         Back to All Opportunities
//                     </Link>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
//                     <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
//                         <h1 className="text-3xl font-bold">Your Best Matches</h1>
//                         <p className="text-primary-100 mt-2">
//                             Opportunities tailored to your skills and location
//                         </p>
//                     </div>

//                     <div className="p-6">
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
//                                 {error}
//                             </div>
//                         )}

//                         {/* Filters */}
//                         <div className="flex flex-col md:flex-row gap-4 mb-6">
//                             <div className="flex items-center gap-2">
//                                 <Filter className="h-5 w-5 text-gray-600" />
//                                 <span className="text-sm font-medium text-gray-700">Filter by skill:</span>
//                                 <select
//                                     value={filterSkill}
//                                     onChange={(e) => setFilterSkill(e.target.value)}
//                                     className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
//                                 >
//                                     {getUniqueSkills().map(skill => (
//                                         <option key={skill} value={skill}>
//                                             {skill === 'all' ? 'All Skills' : skill}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <span className="text-sm font-medium text-gray-700">Sort by:</span>
//                                 <select
//                                     value={sortBy}
//                                     onChange={(e) => setSortBy(e.target.value)}
//                                     className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
//                                 >
//                                     <option value="overall">Best Match</option>
//                                     <option value="skills">Skill Match</option>
//                                     <option value="distance">Distance</option>
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Results */}
//                         {filteredAndSortedMatches.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <div className="text-gray-400 mb-4">
//                                     <Star className="h-12 w-12 mx-auto" />
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                                     {matches.length === 0 ? 'No matches yet' : 'No matches with selected filter'}
//                                 </h3>
//                                 <p className="text-gray-600 mb-4">
//                                     {matches.length === 0
//                                         ? "Complete your profile with skills and location to get better matches."
//                                         : "Try selecting different filters to see more opportunities."
//                                     }
//                                 </p>
//                                 {matches.length === 0 && (
//                                     <Link to="/profile" className="btn-primary">
//                                         Complete Your Profile
//                                     </Link>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="grid gap-6">
//                                 {filteredAndSortedMatches.map((match, index) => (
//                                     <div
//                                         key={match.opportunity?._id || index}
//                                         className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
//                                     >
//                                         <div className="p-6">
//                                             <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
//                                                 <div className="flex-1">
//                                                     <div className="flex items-start justify-between">
//                                                         <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                                                             {match.opportunity?.title || 'Untitled Opportunity'}
//                                                         </h3>
//                                                         {index === 0 && (
//                                                             <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full ml-2">
//                                                                 Best Match
//                                                             </span>
//                                                         )}
//                                                     </div>

//                                                     <p className="text-gray-600 mb-4 line-clamp-2">
//                                                         {match.opportunity?.description || 'No description provided.'}
//                                                     </p>

//                                                     <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//                                                         <div className="flex items-center">
//                                                             <MapPin className="h-4 w-4 mr-1 text-primary-600" />
//                                                             <span>
//                                                                 {match.opportunity?.location?.city || 'Unknown'},{' '}
//                                                                 {match.opportunity?.location?.zipCode || ''}
//                                                             </span>
//                                                         </div>
//                                                         <div className="flex items-center">
//                                                             <Calendar className="h-4 w-4 mr-1 text-primary-600" />
//                                                             <span>{formatDate(match.opportunity?.date)}</span>
//                                                         </div>
//                                                         <div className="flex items-center">
//                                                             <Users className="h-4 w-4 mr-1 text-primary-600" />
//                                                             <span>
//                                                                 {match.opportunity?.volunteersRegistered?.length || 0} /{' '}
//                                                                 {match.opportunity?.volunteersNeeded || 0}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-4 md:mt-0 md:ml-6">
//                                                     <div className="bg-gray-50 rounded-lg p-4 min-w-[120px]">
//                                                         <div className="text-center mb-2">
//                                                             <span className="text-2xl font-bold text-primary-600">
//                                                                 {match.matchScore?.overall || 0}%
//                                                             </span>
//                                                             <div className="text-xs text-gray-600">Overall Match</div>
//                                                         </div>

//                                                         <div className="grid grid-cols-2 gap-2 text-xs">
//                                                             <div className="text-center">
//                                                                 <span className={`font-medium ${getSkillMatchColor(match.matchScore?.skills || 0)}`}>
//                                                                     {match.matchScore?.skills || 0}%
//                                                                 </span>
//                                                                 <div className="text-gray-600">Skills</div>
//                                                             </div>
//                                                             <div className="text-center">
//                                                                 <span className="font-medium text-gray-700">
//                                                                     {match.matchScore?.distance ?? '?'}mi
//                                                                 </span>
//                                                                 <div className="text-gray-600">Distance</div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="mb-4">
//                                                 <h4 className="font-medium text-gray-800 mb-2">Required Skills:</h4>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {Array.isArray(match.opportunity?.requiredSkills) &&
//                                                         match.opportunity.requiredSkills.map((skill, idx) => (
//                                                             <span
//                                                                 key={idx}
//                                                                 className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
//                                                             >
//                                                                 {skill}
//                                                             </span>
//                                                         ))}
//                                                 </div>
//                                             </div>

//                                             <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
//                                                 <div className="text-sm text-gray-600">
//                                                     <p>{getDistanceText(match.matchScore?.distance)}</p>
//                                                     {match.matchScore?.duration && (
//                                                         <p>Approx. {match.matchScore.duration} travel time</p>
//                                                     )}
//                                                 </div>

//                                                 <div className="flex gap-2">
//                                                     <Link
//                                                         to={`/opportunities/${match.opportunity?._id || ''}`}
//                                                         className="btn-primary"
//                                                     >
//                                                         View Details
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {filteredAndSortedMatches.length > 0 && (
//                     <div className="bg-white rounded-xl shadow-md p-6">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">How Matching Works</h2>
//                         <div className="grid md:grid-cols-3 gap-4">
//                             <div className="p-4 bg-blue-50 rounded-lg">
//                                 <h3 className="font-medium text-blue-800 mb-2">Skill Matching (70%)</h3>
//                                 <p className="text-sm text-gray-600">
//                                     We compare your skills with the opportunity's required skills. Higher skill overlap means a better match.
//                                 </p>
//                             </div>
//                             <div className="p-4 bg-green-50 rounded-lg">
//                                 <h3 className="font-medium text-green-800 mb-2">Distance (30%)</h3>
//                                 <p className="text-sm text-gray-600">
//                                     Opportunities closer to your location receive higher scores. We calculate travel distance using Google Maps.
//                                 </p>
//                             </div>
//                             <div className="p-4 bg-purple-50 rounded-lg">
//                                 <h3 className="font-medium text-purple-800 mb-2">Overall Score</h3>
//                                 <p className="text-sm text-gray-600">
//                                     The final score combines skill matching (70%) and proximity (30%) to give you the best opportunities first.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MatchingResults;






import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, ArrowLeft, Filter } from 'lucide-react';
import { matchingAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MatchingResults = () => {
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('overall');
    const [filterSkill, setFilterSkill] = useState('all');

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const response = await matchingAPI.getMatches();

            // ✅ ensure correct array shape
            const data = Array.isArray(response.data?.data) ? response.data.data : [];
            // normalize distance as number
            const normalized = data.map(m => ({
                ...m,
                matchScore: {
                    ...m.matchScore,
                    distance: m.matchScore?.distance
                        ? parseFloat(m.matchScore.distance)
                        : null,
                    skills: m.matchScore?.skills
                        ? parseFloat(m.matchScore.skills)
                        : 0,
                    overall: m.matchScore?.overall
                        ? parseFloat(m.matchScore.overall)
                        : 0,
                },
            }));
            setMatches(normalized);
            setError(null);
        } catch (error) {
            console.error('Error fetching matches:', error);
            setError('Failed to load matched opportunities');
        } finally {
            setLoading(false);
        }
    };

    const getSkillMatchColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getDistanceText = (distance) => {
        if (!distance) return 'Distance not available';
        return `${distance.toFixed(1)} km away`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getUniqueSkills = () => {
        const allSkills = matches.flatMap(match =>
            Array.isArray(match.opportunity?.requiredSkills)
                ? match.opportunity.requiredSkills
                : []
        );
        return ['all', ...new Set(allSkills)].filter(Boolean);
    };

    const filteredAndSortedMatches = matches
        .filter(match => {
            if (filterSkill === 'all') return true;
            return (
                Array.isArray(match.opportunity?.requiredSkills) &&
                match.opportunity.requiredSkills.includes(filterSkill)
            );
        })
        .sort((a, b) => {
            if (sortBy === 'skills') {
                return (b.matchScore?.skills || 0) - (a.matchScore?.skills || 0);
            } else if (sortBy === 'distance') {
                return (a.matchScore?.distance ?? Infinity) - (b.matchScore?.distance ?? Infinity);
            }
            return (b.matchScore?.overall || 0) - (a.matchScore?.overall || 0);
        });

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
                <div className="mb-6">
                    <Link
                        to="/opportunities"
                        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to All Opportunities
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold">Your Best Matches</h1>
                        <p className="text-primary-100 mt-2">
                            Opportunities tailored to your skills and location
                        </p>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Filter by skill:</span>
                                <select
                                    value={filterSkill}
                                    onChange={(e) => setFilterSkill(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                                >
                                    {getUniqueSkills().map(skill => (
                                        <option key={skill} value={skill}>
                                            {skill === 'all' ? 'All Skills' : skill}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                                >
                                    <option value="overall">Best Match</option>
                                    <option value="skills">Skill Match</option>
                                    <option value="distance">Distance</option>
                                </select>
                            </div>
                        </div>

                        {/* Results */}
                        {filteredAndSortedMatches.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-4">
                                    <Star className="h-12 w-12 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {matches.length === 0 ? 'No matches yet' : 'No matches with selected filter'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {matches.length === 0
                                        ? "Complete your profile with skills and location to get better matches."
                                        : "Try selecting different filters to see more opportunities."
                                    }
                                </p>
                                {matches.length === 0 && (
                                    <Link to="/profile" className="btn-primary">
                                        Complete Your Profile
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {filteredAndSortedMatches.map((match, index) => (
                                    <div
                                        key={match.opportunity?._id || index}
                                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                            {match.opportunity?.title || 'Untitled Opportunity'}
                                                        </h3>
                                                        {index === 0 && (
                                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full ml-2">
                                                                Best Match
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                                        {match.opportunity?.description || 'No description provided.'}
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1 text-primary-600" />
                                                            <span>
                                                                {match.opportunity?.location?.city || 'Unknown'},{' '}
                                                                {match.opportunity?.location?.zipCode || ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1 text-primary-600" />
                                                            <span>{formatDate(match.opportunity?.date)}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1 text-primary-600" />
                                                            <span>
                                                                {match.opportunity?.volunteersRegistered?.length || 0} /{' '}
                                                                {match.opportunity?.volunteersNeeded || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 md:mt-0 md:ml-6">
                                                    <div className="bg-gray-50 rounded-lg p-4 min-w-[120px]">
                                                        <div className="text-center mb-2">
                                                            <span className="text-2xl font-bold text-primary-600">
                                                                {match.matchScore?.overall || 0}%
                                                            </span>
                                                            <div className="text-xs text-gray-600">Overall Match</div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div className="text-center">
                                                                <span className={`font-medium ${getSkillMatchColor(match.matchScore?.skills || 0)}`}>
                                                                    {match.matchScore?.skills || 0}%
                                                                </span>
                                                                <div className="text-gray-600">Skills</div>
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="font-medium text-gray-700">
                                                                    {match.matchScore?.distance != null ? `${match.matchScore.distance.toFixed(1)} km` : '?'}
                                                                </span>
                                                                <div className="text-gray-600">Distance</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-800 mb-2">Required Skills:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(match.opportunity?.requiredSkills) &&
                                                        match.opportunity.requiredSkills.map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                                                <div className="text-sm text-gray-600">
                                                    <p>{getDistanceText(match.matchScore?.distance)}</p>
                                                    {match.matchScore?.duration && (
                                                        <p>Approx. {match.matchScore.duration} travel time</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/opportunities/${match.opportunity?._id || ''}`}
                                                        className="btn-primary"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchingResults;
