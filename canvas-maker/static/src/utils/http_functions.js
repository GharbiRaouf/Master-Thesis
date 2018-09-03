/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/v1/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password) {
    return axios.post('api/v1/create_user', {
        email,
        password,
    });
}

export function update_user(email, password, username, token) {
    return axios.post('api/v1/update_user', {
        email,
        password,
        username
    }, tokenConfig(token));
}

export function get_token(email, password) {
    return axios.post('api/v1/get_token', {
        email,
        password,
    });
}

export function has_github_token(token) {
    return axios.get('api/v1/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('api/v1/user', tokenConfig(token));
}

export function create_new_canvas(canvas_type, token) {
    return axios.post('api/v1/new_canvas', {
        "canvas_type": canvas_type
    }, tokenConfig(token))
}

export function get_canvas_by_id(canvas_id, token) {
    return axios.post('api/v1/get_canvas_by_canvas_id', {
        "canvas_id": canvas_id,
    }, tokenConfig(token))
}


export function post_canvas_update(canvas, token) {
    return axios.post('api/v1/update_canvas', {
        "canvas": canvas,
    }, tokenConfig(token))
}

export function load_all_user_canvas(token) {
    return axios.post('api/v1/get_canvas_by_user', {}, tokenConfig(token))
}
