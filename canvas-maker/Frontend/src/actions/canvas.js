import { UPDATE_CANVAS, FETCH_USER_CANVAS, LOAD_USER_CANVAS, FETCH_CANVAS, LOAD_CANVAS, SAVE_CANVAS, SAVE_CANVAS_DONE, MUST_SAVE_CANVAS, ON_DELETE_CANVAS, DELETE_CANVAS_DONE, MAKE_ANONYMOUS_CANVAS, HANDLE_CANVAS_HELPER } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { create_new_canvas, load_all_user_canvas, get_canvas_by_id, post_canvas_update, delete_canvas } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import { push } from 'react-router-redux';


export function fetchingCanvasData() {
    return {
        type: FETCH_CANVAS,
    };
}

export function loadCanvasData(data) {
    return {
        type: LOAD_CANVAS,
        payload: data
    }
}
export function mustSaveCanvas() {
    return {
        type: MUST_SAVE_CANVAS
    }
}

export function createNewCanvas(canvas_type, token,g) {
    return (dispatch) => {
        dispatch(fetchingCanvasData());
        create_new_canvas(canvas_type, token)
            .then((response) => {
                return parseJSON(response)
            })
            .then(response => {

                dispatch(loadCanvasData(response.canvas));
                dispatch(push("/"+g+"/designer/" + response.canvas.canvas_id))
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function setCanvasToEdit(canvas_id, token) {
    return (dispatch) => {
        dispatch(fetchingCanvasData());
        get_canvas_by_id(canvas_id, token).then((response) => {
            return parseJSON(response)

        })
            .then(response => {
                dispatch(loadCanvasData(response.canvas));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    }
}
export function saveCanvas(newPreview) {
    return {
        type: SAVE_CANVAS,
        payload: newPreview
    }
}
export function saveCanvasDone() {
    return {
        type: SAVE_CANVAS_DONE
    }
}
export function updateAndSaveCanvas(canvas, newPreview, token) {
    return (dispatch) => {
        dispatch(saveCanvas(newPreview));
        if (token === null) {
            dispatch(saveCanvasDone());
        }
        if(newPreview!=="rating_update")canvas.canvas_lastUpdate=Date.now()
        post_canvas_update(canvas, token).then((response) => {
            return parseJSON(response)

        })
            .then(response => {
                dispatch(saveCanvasDone());


            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    }
}

export function updateCanvas(field, newdata) {

    return {
        type: UPDATE_CANVAS,
        payload: { field, newdata }
    }
}

export function fetchingUserCanvasData() {
    return {
        type: FETCH_USER_CANVAS,
    };
}

export function loadUserCanvasData(data) {
    return {
        type: LOAD_USER_CANVAS,
        payload: data
    }
}

export function loadAllUserCanvas(token) {
    return (dispatch) => {
        dispatch(fetchingUserCanvasData());
        load_all_user_canvas(token)
            .then((response) => {
                return parseJSON(response)
            })
            .then(response => {
                dispatch(loadUserCanvasData(response.user_canvas));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
export function onDeleteCanvas() {
    return {
        type: ON_DELETE_CANVAS
    }
}
export function deleteDone(status) {
    return {
        type: DELETE_CANVAS_DONE,
        payload: status
    }
}
export function deleteCanvas(canvas_id, token) {
    return (dispatch) => {
        dispatch(onDeleteCanvas());
        delete_canvas(canvas_id, token)
            .then((response) => {
                return parseJSON(response)
            })
            .then(response => {
                dispatch(deleteDone(response.deleteState));
                dispatch(loadAllUserCanvas(token))
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function makeAnonymousCanvas(canvas_type) {
    return {
        type: MAKE_ANONYMOUS_CANVAS,
        payload:canvas_type
    }
}

export function ShowCanvasHelper(){
    return{
        type:HANDLE_CANVAS_HELPER,
    }
}