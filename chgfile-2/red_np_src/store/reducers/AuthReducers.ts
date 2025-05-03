import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { buildSubStateSelector } from '../config/subSelector'

const initialState: AuthState = {
  userId: '',
  email: '',
  userName: '',
  userEmoji: '',
  userLevel: {
    'All Categories': 1,
    'Financial Ratios and Indicators': 1,
    'Types of Investments': 1,
    'Stock Market Fundamentals': 1,
    'Value Investing': 1,
    'Growth Investing': 1,
    'Stock Market Strategies': 1,
    'Index Funds and ETFs': 1,
    'Risk Management': 1,
    'Portfolio Diversification': 1,
    'Behavioral Finance': 1,
    'Stock Facts': 1,
    Cryptocurrency: 1,
    BuyorSell: 1,
    BullorBear: 1,
  },
  weeklyRank: 17317,
  prevWeeklyRank: 18279,
  userSwipe: 0,
  userBio: '',
  redCoins: 0,
  alpacaToken: '',
  isLoggedIn: false,
  loading: false,
  errorMessage: '',
  fcmToken: '',
}

export type AuthAppState = typeof initialState

export const authSlice = createSlice<
  AuthAppState,
  {
    setLoading: CaseReducer<
      AuthAppState,
      PayloadAction<{ loading: boolean; errorMessage?: string }>
    >
    resetErrorMessage: CaseReducer<AuthAppState>

    setTempProfileUrl: CaseReducer<
      AuthAppState,
      PayloadAction<{
        url: any
      }>
    >
    setAuth: CaseReducer<
      AuthAppState,
      PayloadAction<{
        userId: string
        email: string
        userName: string
        userEmoji: string
        weeklyRank: number
        userBio: string
        redCoins: number
        userLevel: { [category: string]: number }
        userSwipe: number
        prevWeeklyRank: number
        isLoggedIn: boolean
      }>
    >
    setUserName: CaseReducer<
      AuthAppState,
      PayloadAction<{
        userName: string
      }>
    >
    setUserEmoji: CaseReducer<
      AuthAppState,
      PayloadAction<{
        userEmoji: string
      }>
    >
    setWeeklyRank: CaseReducer<
      AuthAppState,
      PayloadAction<{
        weeklyRank: number
      }>
    >
    sePrevWeeklyRank: CaseReducer<
      AuthAppState,
      PayloadAction<{
        prevWeeklyRank: number
      }>
    >
    setUserBio: CaseReducer<
      AuthAppState,
      PayloadAction<{
        userBio: string
      }>
    >
    setRedCoins: CaseReducer<
      AuthAppState,
      PayloadAction<{
        redCoins: number
      }>
    >
    setUserLevel: CaseReducer<
      AuthAppState,
      PayloadAction<{
        userLevel: { [category: string]: number }
      }>
    >
    setUserSwipe: CaseReducer<
      AuthAppState,
      PayloadAction<{
        userSwipe: number
      }>
    >
    setFcmToken: CaseReducer<AuthAppState, PayloadAction<{ fcmToken: string }>>
    setAlpaceToken: CaseReducer<AuthAppState, PayloadAction<{ alpacaToken: string }>>

    forgetPassword: CaseReducer<AuthAppState, PayloadAction<{ email: string }>>
    logoutUser: CaseReducer<AuthAppState>
  }
>({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      return {
        ...state,
        loading: payload.loading,
        errorMessage: payload.errorMessage || '',
      }
    },
    resetErrorMessage: (state, { payload }) => {
      return {
        ...state,
        errorMessage: '',
      }
    },

    setTempProfileUrl: (state, { payload }) => {
      return {
        ...state,
        tempProfileUrl: payload.url,
      }
    },
    setAuth: (state, { payload }) => {
      return {
        ...state,
        email: payload.email,
        userId: payload.userId,
        userName: payload.userName,
        userEmoji: payload.userEmoji,
        userLevel: payload.userLevel,
        userSwipe: payload.userSwipe,
        userBio: payload.userBio,
        redCoins: payload.redCoins,
        isLoggedIn: payload.isLoggedIn,
        loading: false,
        weeklyRank: payload.weeklyRank,
        prevWeeklyRank: payload.prevWeeklyRank,
      }
    },
    setUserName: (state, { payload }) => {
      return {
        ...state,
        userName: payload.userName,
      }
    },
    setWeeklyRank: (state, { payload }) => {
      return {
        ...state,
        weeklyRank: payload.weeklyRank,
      }
    },
    setPrevWeeklyRank: (state, { payload }) => {
      return {
        ...state,
        prevWeeklyRank: payload.prevWeeklyRank,
      }
    },
    setUserEmoji: (state, { payload }) => {
      return {
        ...state,
        userEmoji: payload.userEmoji,
      }
    },
    setUserBio: (state, { payload }) => {
      return {
        ...state,
        userBio: payload.userBio,
      }
    },
    setRedCoins: (state, { payload }) => {
      return {
        ...state,
        redCoins: payload.redCoins,
      }
    },
    setUserLevel: (state, { payload }) => {
      return {
        ...state,
        userLevel: payload.userLevel,
      }
    },
    setUserSwipe: (state, { payload }) => {
      return {
        ...state,
        userSwipe: payload.userSwipe,
      }
    },
    setFcmToken: (state, { payload }) => {
      return {
        ...state,
        fcmToken: payload.fcmToken,
      }
    },
    setAlpaceToken: (state, { payload }) => {
      return {
        ...state,
        alpacaToken: payload.alpacaToken,
      }
    },
    forgetPassword: (state, { payload }) => {
      return {
        ...state,
        email: payload.email,
      }
    },
    logoutUser: state => {
      return {
        ...state,
        email: '',
        userId: '',
        role: '',
        tempProfileUrl: '',
      }
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
})
export const useAuthSelector = buildSubStateSelector<AuthAppState>(state => state.auth)

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer
