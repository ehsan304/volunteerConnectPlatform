import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return { ...state, loading: true, error: null };
        case "LOGIN_SUCCESS":
            return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
        case "LOGIN_FAILURE":
            return { ...state, loading: false, user: null, isAuthenticated: false, error: action.payload };
        case "LOGOUT":
            return { ...state, user: null, isAuthenticated: false, error: null };
        case "CLEAR_ERROR":
            return { ...state, error: null };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false, // ✅ Start in loading until verify runs
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is already logged in (cookie-based)
    useEffect(() => {
        authAPI.verifyToken()
            .then((res) => {
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
            })
            .catch(() => {
                dispatch({ type: "LOGOUT" });
            });
    }, []);

    const login = async (email, password) => {
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await authAPI.login({ email, password });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed";
            dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (userData) => {
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await authAPI.signup(userData);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Signup failed";
            dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        await authAPI.logout();
        dispatch({ type: "LOGOUT" });
    };

    const clearError = useCallback(() => {
        dispatch({ type: "CLEAR_ERROR" });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
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
    return useContext(AuthContext);
};
