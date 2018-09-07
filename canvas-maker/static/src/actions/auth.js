import { push } from 'react-router-redux';

import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGIN_USER_REQUEST,
    LOGOUT_USER,
    REGISTER_USER_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    REGISTER_ANONYMOUS_USER,
} from '../constants/index';

import { parseJSON } from '../utils/misc';
import { get_token, create_user, update_user } from '../utils/http_functions';


export function loginUserSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: LOGIN_USER_SUCCESS,
        payload: {
            token,
        },
    };
}


export function loginUserFailure(error) {
    localStorage.removeItem('token');
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST,
    };
}

export function logout() {
    localStorage.removeItem('token');
    return {
        type: LOGOUT_USER,
    };
}

export function logoutAndRedirect() {
    return (dispatch) => {
        dispatch(logout());
        dispatch(push('/'));
    };
}

export function redirectToRoute(route) {
    return (dispatch) => {
        dispatch(push(route));
    };
}

export function loginUser(email, password) {
    return function (dispatch) {
        dispatch(loginUserRequest());
        return get_token(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess(response.token));
                    dispatch(push('/main'));
                } catch (e) {
                    alert(e);
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid username or password',
                    },
                }));
            });
    };
}

export function updateUserRequest() {
    return {
        type: UPDATE_USER_REQUEST,
    }
}

export function updateUserSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: UPDATE_USER_SUCCESS,
        payload: {
            token,
        },
    };
}

export function updateUserFailure(error) {
    // localStorage.removeItem('token');
    return {
        type: UPDATE_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function updateUser(email, password, username) {
    return function (dispatch) {
        dispatch(updateUserRequest());
        return update_user(email, password, username).
            then(parseJSON).
            then(response => {
                try {
                    dispatch(updateUserSuccess(response.token));
                    dispatch(push('/main'));
                } catch (e) {
                    dispatch(updateUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Something went Wrong!',
                        },
                    }));
                }
            })
    }
}

export function registerUserRequest() {
    return {
        type: REGISTER_USER_REQUEST,
    };
}

export function registerUserSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: REGISTER_USER_SUCCESS,
        payload: {
            token,
        },
    };
}

export function registerUserFailure(error) {
    localStorage.removeItem('token');
    return {
        type: REGISTER_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function registerUser(email, password) {
    return function (dispatch) {
        dispatch(registerUserRequest());
        return create_user(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(registerUserSuccess(response.token));
                    dispatch(push('/main'));
                } catch (e) {
                    dispatch(registerUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(registerUserFailure({
                    response: {
                        status: 403,
                        statusText: 'User with that email already exists',
                    },
                }
                ));
            });
    };
}


export function registerAnonymousUser(){
    return {
        type:REGISTER_ANONYMOUS_USER
    }
}