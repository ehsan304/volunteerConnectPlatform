import { useState, useEffect } from 'react';
import { MapPin, Calendar, Briefcase, User, Save } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import LoadingSpinner from '../common/LoadingSpinner';

const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
];

const commonSkills = [
    'Teaching',
    'Mentoring',
    'First Aid',
    'Gardening',
    'Cooking',
    'Cleaning',
    'Construction',
    'IT Support',
    'Administration',
    'Fundraising',
    'Event Planning',
    'Marketing',
    'Social Media',
    'Graphic Design',
    'Photography',
    'Videography',
    'Music',
    'Art',
    'Sports',
    'Childcare',
    'Elderly Care',
    'Animal Care',
    'Driving',
    'Language Translation'
];

const ProfileForm = ({ profile }) => {
    const { updating, updateError, updateProfile, clearErrors } = useProfile();
    const [formData, setFormData] = useState({
        fullName: '',
        location: {
            city: '',
            zipCode: '',
            coordinates: {
                type: 'Point',
                coordinates: [0, 0]
            }
        },
        skills: [],
        availability: {
            days: [],
            times: {
                start: '',
                end: ''
            }
        }
    });
    const [newSkill, setNewSkill] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                location: {
                    city: profile.location?.city || '',
                    zipCode: profile.location?.zipCode || '',
                    coordinates: profile.location?.coordinates || {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                },
                skills: profile.skills || [],
                availability: {
                    days: profile.availability?.days || [],
                    times: {
                        start: profile.availability?.times?.start || '',
                        end: profile.availability?.times?.end || ''
                    }
                }
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear errors and success message when user starts typing
        if (updateError) clearErrors();
        if (successMessage) setSuccessMessage('');
    };

    const handleSkillAdd = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleDayToggle = (day) => {
        setFormData(prev => {
            const days = prev.availability.days.includes(day)
                ? prev.availability.days.filter(d => d !== day)
                : [...prev.availability.days, day];

            return {
                ...prev,
                availability: {
                    ...prev.availability,
                    days
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfile(formData);

        if (result.success) {
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {updateError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {updateError}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {successMessage}
                </div>
            )}

            {/* Personal Information Section */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary-600" />
                    Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="Enter your full name"
                        />
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                    Location
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            id="location.city"
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="Enter your city"
                        />
                    </div>

                    <div>
                        <label htmlFor="location.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                        </label>
                        <input
                            type="text"
                            id="location.zipCode"
                            name="location.zipCode"
                            value={formData.location.zipCode}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="Enter your ZIP code"
                        />
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase  className="h-5 w-5 mr-2 text-primary-600" />
                    Skills
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Skills
                    </label>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => handleSkillRemove(skill)}
                                    className="ml-2 text-primary-600 hover:text-primary-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}

                        {formData.skills.length === 0 && (
                            <p className="text-gray-500 text-sm">No skills added yet</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="input-field flex-1"
                            placeholder="Add a skill"
                        />
                        <button
                            type="button"
                            onClick={handleSkillAdd}
                            className="btn-secondary"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Common Skills
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {commonSkills.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => {
                                    if (!formData.skills.includes(skill)) {
                                        setFormData(prev => ({
                                            ...prev,
                                            skills: [...prev.skills, skill]
                                        }));
                                    }
                                }}
                                disabled={formData.skills.includes(skill)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors ${formData.skills.includes(skill)
                                        ? 'bg-primary-600 text-white cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Availability Section */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                    Availability
                </h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Days
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                        {daysOfWeek.map((day) => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`p-2 rounded-lg text-sm font-medium text-center transition-colors ${formData.availability.days.includes(day)
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="availability.times.start" className="block text-sm font-medium text-gray-700 mb-1">
                            Available From
                        </label>
                        <input
                            type="time"
                            id="availability.times.start"
                            name="availability.times.start"
                            value={formData.availability.times.start}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="availability.times.end" className="block text-sm font-medium text-gray-700 mb-1">
                            Available Until
                        </label>
                        <input
                            type="time"
                            id="availability.times.end"
                            name="availability.times.end"
                            value={formData.availability.times.end}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={updating}
                    className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {updating ? (
                        <>
                            <LoadingSpinner size="small" />
                            <span className="ml-2">Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Profile
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;