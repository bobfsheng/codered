import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { rootReducer } from './config/reducers'
// const middlewares = getDefaultMiddleware({
//   // https://github.com/reduxjs/redux-toolkit/issues/415
//   immutableCheck: false,
// })
// export type RootState = ReturnType<typeof rootReducer>
const store = configureStore({
  reducer: rootReducer,
  // middleware: middlewares,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
})
export type AppDispatch = typeof store.dispatch
export const useReduxDispatch = (): AppDispatch => useDispatch<AppDispatch>()

export const useReduxSelector = useSelector
export * from './actions'
export * from './reducers'
export default store
