import { configureStore, combineReducers } from '@reduxjs/toolkit'
const loginReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_USER":
            return [...state, { email: action.payload.email, password: action.payload.password }]
        default: return state
    }
}
const rootReducer = combineReducers({
    login: loginReducer
});

export default rootReducer;