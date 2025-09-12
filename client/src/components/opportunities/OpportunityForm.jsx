import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Clock, X, Plus } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const OpportunityForm = ({ opportunity, onSubmit, loading, error }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: {
            address: '',
            city: '',
            zipCode: '',
            coordinates: {
                type: 'Point',
                coordinates: [0, 0]
            }
        },
        requiredSkills: [],
        date: '',
        time: {
            start: '',
            end: ''
        },
        volunteersNeeded: 1
    });
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (opportunity) {
            setFormData({
                title: opportunity.title || '',
                description: opportunity.description || '',
                location: {
                    address: opportunity.location?.address || '',
                    city: opportunity.location?.city || '',
                    zipCode: opportunity.location?.zipCode || '',
                    coordinates: opportunity.location?.coordinates || {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                },
                requiredSkills: opportunity.requiredSkills || [],
                date: opportunity.date ? new Date(opportunity.date).toISOString().split('T')[0] : '',
                time: {
                    start: opportunity.time?.start || '',
                    end: opportunity.time?.end || ''
                },
                volunteersNeeded: opportunity.volunteersNeeded || 1
            });
        }
    }, [opportunity]);

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
    };

    const handleSkillAdd = () => {
        if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

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
        'Marketing'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Opportunity Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter a descriptive title for your opportunity"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="input-field"
                    placeholder="Describe the opportunity in detail, including tasks, benefits, and requirements"
                />
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                    </label>
                    <input
                        type="text"
                        id="location.address"
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Full street address"
                    />
                </div>

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
                        placeholder="City name"
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
                        placeholder="ZIP code"
                    />
                </div>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                    />
                </div>

                <div>
                    <label htmlFor="time.start" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                    </label>
                    <input
                        type="time"
                        id="time.start"
                        name="time.start"
                        value={formData.time.start}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div>
                    <label htmlFor="time.end" className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                    </label>
                    <input
                        type="time"
                        id="time.end"
                        name="time.end"
                        value={formData.time.end}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
            </div>

            {/* Volunteers Needed */}
            <div>
                <label htmlFor="volunteersNeeded" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Volunteers Needed *
                </label>
                <input
                    type="number"
                    id="volunteersNeeded"
                    name="volunteersNeeded"
                    value={formData.volunteersNeeded}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field"
                />
            </div>

            {/* Skills Required */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills *
                </label>

                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.requiredSkills.map((skill, index) => (
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
                                    <X className="h-4 w-4" />
                                </button>
                            </span>
                        ))}

                        {formData.requiredSkills.length === 0 && (
                            <p className="text-gray-500 text-sm">No skills added yet</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="input-field flex-1"
                            placeholder="Add a required skill"
                        />
                        <button
                            type="button"
                            onClick={handleSkillAdd}
                            className="btn-secondary"
                        >
                            <Plus className="h-4 w-4" />
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
                                    if (!formData.requiredSkills.includes(skill)) {
                                        setFormData(prev => ({
                                            ...prev,
                                            requiredSkills: [...prev.requiredSkills, skill]
                                        }));
                                    }
                                }}
                                disabled={formData.requiredSkills.includes(skill)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors ${formData.requiredSkills.includes(skill)
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

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <LoadingSpinner size="small" />
                            <span className="ml-2">Saving...</span>
                        </>
                    ) : (
                        <>
                            {opportunity ? 'Update Opportunity' : 'Create Opportunity'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default OpportunityForm;