// server/contexts/ProfileContext.jsx
import { createContext, useContext, useReducer, useCallback } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

const profileReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_PROFILE_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_PROFILE_SUCCESS':
            return {
                ...state,
                loading: false,
                profile: action.payload,
                error: null,
            };
        case 'FETCH_PROFILE_FAILURE':
            return {
                ...state,
                loading: false,
                profile: null,
                error: action.payload,
            };
        case 'UPDATE_PROFILE_START':
            return {
                ...state,
                updating: true,
                updateError: null,
            };
        case 'UPDATE_PROFILE_SUCCESS':
            return {
                ...state,
                updating: false,
                profile: action.payload,
                updateError: null,
            };
        case 'UPDATE_PROFILE_FAILURE':
            return {
                ...state,
                updating: false,
                updateError: action.payload,
            };
        case 'CLEAR_PROFILE_ERRORS':
            return {
                ...state,
                error: null,
                updateError: null,
            };
        default:
            return state;
    }
};

const initialState = {
    profile: null,
    loading: false,
    updating: false,
    error: null,
    updateError: null,
};

export const ProfileProvider = ({ children }) => {
    const [state, dispatch] = useReducer(profileReducer, initialState);
    const { user } = useAuth();

    const fetchProfile = useCallback(async () => {
        if (user?.role !== 'volunteer') {
            dispatch({ type: 'FETCH_PROFILE_FAILURE', payload: 'User is not a volunteer' });
            return;
        }

        dispatch({ type: 'FETCH_PROFILE_START' });
        try {
            const response = await profileAPI.get();
            dispatch({
                type: 'FETCH_PROFILE_SUCCESS',
                payload: response.data,
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
            dispatch({
                type: 'FETCH_PROFILE_FAILURE',
                payload: errorMessage,
            });
        }
    }, [user?.role]);

    const updateProfile = useCallback(async (profileData) => {
        dispatch({ type: 'UPDATE_PROFILE_START' });
        try {
            const response = await profileAPI.update(profileData);
            dispatch({
                type: 'UPDATE_PROFILE_SUCCESS',
                payload: response.data,
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            dispatch({
                type: 'UPDATE_PROFILE_FAILURE',
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    }, []);

    const clearErrors = useCallback(() => {
        dispatch({ type: 'CLEAR_PROFILE_ERRORS' });
    }, []);

    return (
        <ProfileContext.Provider
            value={{
                profile: state.profile,
                loading: state.loading,
                updating: state.updating,
                error: state.error,
                updateError: state.updateError,
                fetchProfile,
                updateProfile,
                clearErrors,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};