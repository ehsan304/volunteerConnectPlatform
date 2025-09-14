import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, HeartHandshake, Briefcase, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <HeartHandshake className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-800">VolunteerConnect</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/opportunities"
                            className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                        >
                            Opportunities
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user?.role === 'volunteer' && (
                                    <>
                                        <Link
                                            to="/matches"
                                            className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                        >
                                            My Matches
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                        >
                                            <User className="h-4 w-4 mr-1" />
                                            Profile
                                        </Link>
                                    </>

                                )}
                                {user?.role === 'organizer' && (
                                    <>
                                        <Link
                                            to="/my-opportunities"
                                            className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                        >
                                            <Briefcase className="h-4 w-4 mr-1" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            to="/opportunities/create"
                                            className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            New Opportunity
                                        </Link>
                                    </>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn-primary text-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 focus:outline-none transition-colors duration-300"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isOpen && (
                    <div className="md:hidden animate-slide-in">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                            <Link
                                to="/opportunities"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Opportunities
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    {user?.role === 'volunteer' && (
                                        <Link
                                            to="/matches"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            My Matches
                                        </Link>
                                    )}
                                    {user?.role === 'organizer' && (
                                        <Link
                                            to="/my-opportunities"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            My Opportunities
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-300"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-300"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </button>
                                    {user?.role === 'volunteer' && (
                                        <>
                                            <Link
                                                to="/matches"
                                                className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                            >
                                                My Matches
                                            </Link>
                                            <Link
                                                to="/my-applications"
                                                className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                            >
                                                My Applications
                                            </Link>
                                            <Link
                                                to="/profile"
                                                className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                            >
                                                <User className="h-4 w-4 mr-1" />
                                                Profile
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-300"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;