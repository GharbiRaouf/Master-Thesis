import { FETCH_CANVAS, LOAD_CANVAS, FETCH_USER_CANVAS, LOAD_USER_CANVAS, UPDATE_CANVAS, SAVE_CANVAS, SAVE_CANVAS_DONE, MUST_SAVE_CANVAS, DELETE_CANVAS_DONE, ON_DELETE_CANVAS, MAKE_ANONYMOUS_CANVAS, HANDLE_CANVAS_HELPER } from '../constants';
import { createReducer } from '../utils/misc';
import nanoid from 'nanoid'
const initialState = {
    user_canvas: [],
    canvas: null,
    isFetching: false,
    canvasMustSave: false,
    loaded: false,
    isSaving: false,
    onDelete:false,
    apiResponse:null,
    canvas_helper:true,
};

export default createReducer(initialState, {
    [LOAD_CANVAS]: (state, payload) => Object.assign({}, state, {
        canvas: payload,
        isFetching: false,
    }),
    [FETCH_CANVAS]: (state) => Object.assign({}, state, {
        loaded: true,
        isFetching: true,
    }),
    [SAVE_CANVAS]: (state, payload) => Object.assign({}, state, {
        isSaving: true,
        canvas: {
            ...state.canvas,
            canvas_preview: payload,
            canvas_lastUpdate: Date.now()
        }
    }),
    [SAVE_CANVAS_DONE]: (state) => Object.assign({}, state, {
        isSaving: false,
        canvasMustSave: false
    }),
    [MUST_SAVE_CANVAS]: (state) => Object.assign({}, state, {
        canvasMustSave: true
    }),

    [UPDATE_CANVAS]: (state, { field, newdata }) => {
        if (field==="canvas_rating"){
            return {
                ...state,
                canvas: {
                    ...state.canvas,
                    canvas_rating: [...state.canvas.canvas_rating,newdata]
                }
            }
        }
        return {
            ...state,
            canvas: {
                ...state.canvas,
                [field]: newdata
            }
        }
    },
    [FETCH_USER_CANVAS]: (state) => Object.assign({}, state, {
        loaded: true,
        isFetching: true
    }),
    [LOAD_USER_CANVAS]: (state, payload) => Object.assign({}, state, {
        loaded: true,
        user_canvas: payload,
        isFetching: false
    }),
    [ON_DELETE_CANVAS]: (state) =>Object.assign({},state,{
        onDelete:true,
        response: "On going"
    }),
    [DELETE_CANVAS_DONE]: (state,payload) =>Object.assign({},state,{
        onDelete:false,
        apiResponse:payload?"Done":"ERROR ON DELETE"
    }),
    [MAKE_ANONYMOUS_CANVAS]:(state,payload) =>Object.assign({},state,{
        isFetching:false,
        loaded:true,
        canvas:{
            'canvas_id': nanoid(20),
            'canvas_name': "New Canvas",
            'canvas_description': "Canvas Description",
            'canvas_type': payload,
            'canvas_team': [{"user": "unknown", "role":"creator"}],
            'canvas_preview': null,
            'canvas_notes': null,
            'canvas_lastUpdate': Date.now()
        }
    }),
    [HANDLE_CANVAS_HELPER]: (state) => Object.assign({}, state, {
        canvas_helper: !state.canvas_helper
    }),
});
