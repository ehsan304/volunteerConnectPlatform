import { createContext, useContext, useReducer, useEffect, useCallback  } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                user: null,
                token: null,
                isAuthenticated: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        // Check if token exists in localStorage on app start
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token validity with backend
            authAPI.verifyToken(token)
                .then(response => {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user: response.data.user,
                            token: token,
                        },
                    });
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    dispatch({ type: 'LOGOUT' });
                });
        }
    }, []);

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await authAPI.login({ email, password });
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token },
            });

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage,
            });

            return { success: false, error: errorMessage };
        }
    };

    const signup = async (userData) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await authAPI.signup(userData);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token },
            });

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage,
            });

            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    // const clearError = () => {
    //     dispatch({ type: 'CLEAR_ERROR' });
    // };

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, [dispatch]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                error: state.error,
                login,
                signup,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};