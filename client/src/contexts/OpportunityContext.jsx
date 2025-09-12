import { createContext, useContext, useReducer, useCallback } from 'react';
import { opportunitiesAPI } from '../services/api';

const OpportunityContext = createContext();

const opportunityReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_OPPORTUNITIES_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_OPPORTUNITIES_SUCCESS':
            return {
                ...state,
                loading: false,
                opportunities: action.payload,
                error: null,
            };
        case 'FETCH_OPPORTUNITIES_FAILURE':
            return {
                ...state,
                loading: false,
                opportunities: [],
                error: action.payload,
            };
        case 'SET_FILTERS':
            return {
                ...state,
                filters: action.payload,
            };
        case 'CLEAR_FILTERS':
            return {
                ...state,
                filters: {
                    skills: [],
                    location: '',
                    dateRange: {
                        start: '',
                        end: ''
                    }
                },
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

const initialState = {
    opportunities: [],
    loading: false,
    error: null,
    filters: {
        skills: [],
        location: '',
        dateRange: {
            start: '',
            end: ''
        }
    },
};

export const OpportunityProvider = ({ children }) => {
    const [state, dispatch] = useReducer(opportunityReducer, initialState);

    const fetchOpportunities = useCallback(async () => {
        dispatch({ type: 'FETCH_OPPORTUNITIES_START' });
        try {
            const response = await opportunitiesAPI.getAll();
            dispatch({
                type: 'FETCH_OPPORTUNITIES_SUCCESS',
                payload: response.data,
            });
        } catch (error) {
            // Don't show error for unauthorized access - it's handled by the interceptor
            if (error.response?.status !== 401) {
                const errorMessage = error.response?.data?.message || 'Failed to fetch opportunities';
                dispatch({
                    type: 'FETCH_OPPORTUNITIES_FAILURE',
                    payload: errorMessage,
                });
            } else {
                // For 401 errors, just stop loading without showing an error
                dispatch({
                    type: 'FETCH_OPPORTUNITIES_FAILURE',
                    payload: null,
                });
            }
        }
    }, []);

    const setFilters = useCallback((filters) => {
        dispatch({
            type: 'SET_FILTERS',
            payload: filters,
        });
    }, []);

    const clearFilters = useCallback(() => {
        dispatch({ type: 'CLEAR_FILTERS' });
    }, []);

    const clearErrors = useCallback(() => {
        dispatch({ type: 'CLEAR_ERRORS' });
    }, []);

    // Filter opportunities based on current filters
    const getFilteredOpportunities = useCallback(() => {
        if (!state.opportunities || state.opportunities.length === 0) {
            return [];
        }

        return state.opportunities.filter(opportunity => {
            if (!opportunity) return false;

            // Filter by skills
            if (state.filters.skills.length > 0 && opportunity.requiredSkills) {
                const hasMatchingSkill = state.filters.skills.some(filterSkill =>
                    opportunity.requiredSkills.some(skill =>
                        skill.toLowerCase().includes(filterSkill.toLowerCase())
                    )
                );
                if (!hasMatchingSkill) return false;
            }

            // Filter by location
            if (state.filters.location && opportunity.location) {
                const locationMatch =
                    (opportunity.location.city && opportunity.location.city.toLowerCase().includes(state.filters.location.toLowerCase())) ||
                    (opportunity.location.zipCode && opportunity.location.zipCode.toLowerCase().includes(state.filters.location.toLowerCase()));
                if (!locationMatch) return false;
            }

            // Filter by date range
            if (state.filters.dateRange.start && opportunity.date) {
                const opportunityDate = new Date(opportunity.date);
                const startDate = new Date(state.filters.dateRange.start);
                if (opportunityDate < startDate) return false;
            }

            if (state.filters.dateRange.end && opportunity.date) {
                const opportunityDate = new Date(opportunity.date);
                const endDate = new Date(state.filters.dateRange.end);
                if (opportunityDate > endDate) return false;
            }

            return true;
        });
    }, [state.opportunities, state.filters]);

    const value = {
        opportunities: state.opportunities || [],
        filteredOpportunities: getFilteredOpportunities(),
        loading: state.loading,
        error: state.error,
        filters: state.filters,
        fetchOpportunities,
        setFilters,
        clearFilters,
        clearErrors,
    };

    return (
        <OpportunityContext.Provider value={value}>
            {children}
        </OpportunityContext.Provider>
    );
};

export const useOpportunities = () => {
    const context = useContext(OpportunityContext);
    if (!context) {
        throw new Error('useOpportunities must be used within an OpportunityProvider');
    }
    return context;
};