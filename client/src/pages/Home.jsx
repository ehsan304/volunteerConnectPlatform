import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HeartHandshake, Users, MapPin, Calendar } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in">
                            Connect. Volunteer. Make a Difference.
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-in">
                            Join thousands of volunteers and organizations working together to create positive change in communities around the world.
                        </p>
                        <div className="animate-slide-in">
                            {isAuthenticated ? (
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                                        Welcome back, {user?.email}!
                                    </h2>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        {user?.role === 'volunteer' ? (
                                            <>
                                                <Link
                                                    to="/opportunities"
                                                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
                                                >
                                                    Find Opportunities
                                                </Link>
                                                <Link
                                                    to="/profile"
                                                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-300 transform hover:scale-105"
                                                >
                                                    Update Profile
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/opportunities/create"
                                                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
                                                >
                                                    Create Opportunity
                                                </Link>
                                                <Link
                                                    to="/my-opportunities"
                                                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-300 transform hover:scale-105"
                                                >
                                                    View My Opportunities
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to="/signup"
                                        className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/opportunities"
                                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-300 transform hover:scale-105"
                                    >
                                        Browse Opportunities
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-2 -translate-y-8"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform makes it easy to connect volunteers with meaningful opportunities
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 card animate-float">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create a Profile</h3>
                            <p className="text-gray-600">
                                Sign up as a volunteer or organizer and create your personalized profile with skills and preferences.
                            </p>
                        </div>

                        <div className="text-center p-6 card animate-float" style={{ animationDelay: '1s' }}>
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-8 w-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Opportunities</h3>
                            <p className="text-gray-600">
                                Discover volunteer opportunities that match your skills, interests, and location.
                            </p>
                        </div>

                        <div className="text-center p-6 card animate-float" style={{ animationDelay: '2s' }}>
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HeartHandshake className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Make an Impact</h3>
                            <p className="text-gray-600">
                                Connect with organizations and contribute to meaningful causes in your community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
                            <div className="text-gray-600">Active Volunteers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                            <div className="text-gray-600">Organizations</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">5,000+</div>
                            <div className="text-gray-600">Opportunities</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                            <div className="text-gray-600">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Join our community of volunteers and organizations working together to create positive change.
                    </p>
                    {!isAuthenticated && (
                        <Link
                            to="/signup"
                            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 inline-block"
                        >
                            Get Started Today
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;