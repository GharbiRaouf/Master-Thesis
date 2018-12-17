/* eslint camelcase: 0 */

import axios from 'axios';
import { API_URL } from '../constants/utils';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post(API_URL+'is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password,user_group) {
    return axios.post(API_URL+'create_user', {
        email,
        password,
        user_group
    });
}

export function update_user(email, password, username, token) {
    return axios.post(API_URL+'update_user', {
        email,
        password,
        username
    }, tokenConfig(token));
}

export function get_token(email, password,user_group) {
    return axios.post(API_URL+'get_token', {
        email,
        password,
        user_group
    });
}
export async function disconnect(token) {
    return await axios.post(API_URL+'disconnect',{token});
}
export function has_github_token(token) {
    return axios.get(API_URL+'has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get(API_URL+'user', tokenConfig(token));
}

export function create_new_canvas(canvas_type, token) {
    return axios.post(API_URL+'new_canvas', {
        "canvas_type": canvas_type
    }, tokenConfig(token))
}

export function get_canvas_by_id(canvas_id) {
    return axios.post(API_URL+'get_canvas_by_canvas_id', {
        "canvas_id": canvas_id,
    })
}


export function post_canvas_update(canvas, token) {
    return axios.post(API_URL+'update_canvas', {
        "canvas": canvas,
    }, tokenConfig(token))
}


export function delete_canvas(canvas_id, token) {
    return axios.post(API_URL+'delete_canvas', {
        "canvas_id": canvas_id,
    }, tokenConfig(token))
}

export function load_all_user_canvas(token) {
    return axios.post(API_URL+'get_canvas_by_user', {}, tokenConfig(token))
}
