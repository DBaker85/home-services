import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './ui/menuSlice'

export const makeStore = () => {
  return configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    reducer: {
        menu: menuReducer
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']