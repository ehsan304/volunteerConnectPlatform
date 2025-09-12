import { MapPin, Calendar, Users, Clock, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const OpportunityCard = ({ opportunity }) => {
    const { isAuthenticated, user } = useAuth();
    const formattedDate = new Date(opportunity.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {opportunity.title}
                </h3>
                {isAuthenticated && user?.role === 'volunteer' && (
                    <button className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                        <Heart className="h-5 w-5" />
                    </button>
                )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
                {opportunity.description}
            </p>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                    <span>{opportunity.location.address}, {opportunity.location.city}, {opportunity.location.zipCode}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                    <span>{formattedDate}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-primary-600" />
                    <span>{opportunity.time.start} - {opportunity.time.end}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-primary-600" />
                    <span>
                        {opportunity.volunteersRegistered?.length || 0} of {opportunity.volunteersNeeded} volunteers
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                    {opportunity.requiredSkills.slice(0, 4).map((skill, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                    {opportunity.requiredSkills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{opportunity.requiredSkills.length - 4} more
                        </span>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Posted by {opportunity.organizer?.email || 'Organization'}
                </span>

                <div className="flex space-x-2">
                    {isAuthenticated && user?.role === 'volunteer' && (
                        <button className="btn-primary text-sm px-4 py-2">
                            Apply Now
                        </button>
                    )}
                    {!isAuthenticated && (
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="btn-primary text-sm px-4 py-2"
                        >
                            Sign in to Apply
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpportunityCard;