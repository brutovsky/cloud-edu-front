import {configureStore} from '@reduxjs/toolkit'
import authReducer from "../features/auth/Auth";
import {combineReducers} from "redux";

const combinedReducer = combineReducers({
    auth: authReducer
});

const rootReducer = (state, action) => {
    return combinedReducer(state, action);
};

export default configureStore({
    reducer: rootReducer
});
