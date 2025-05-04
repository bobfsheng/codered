import { combineReducers } from '@reduxjs/toolkit'
import { userReducer } from '../reducers/UserReducers'
import { authReducer } from '../reducers/AuthReducers'

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
})
