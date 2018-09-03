import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import data from './data';
import canvas from './canvas';

const rootReducer = combineReducers({
    routing: routerReducer,
    canvas,
    auth,
    data,
    /* your reducers */
});

export default rootReducer;
