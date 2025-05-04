import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@models'
import { infoText } from '@constants/infoText'

import { buildSubStateSelector } from '../config/subSelector'
import { ImageSourcePropType } from 'react-native'
const initialState: UserState = {
  loading: false,
  user: {} as User,
  errorMessage: '',
  accountHistory: [],
  portfolio_equity: null,
  portfolio_value: null,
  long_market_value: '',
  cash: '',
  buying_power: '',
  daytrade_count: null,
  pattern_day_trader: false,
  positions: [],
  orders: [],
  activities: [],
  stockTickers: [],
  onboardingGame: false,
  toolTip1: false,
  toolTip2: false,
  toolTip3: false,
  toolTip4: false,
  toolTip5: false,
  toolTip6: false,
  toolTip7: false,
  toolTip8: false,
  ///////
  marketStatus: false,
  marketNextClose: null,
  marketNextOpen: null,
  //////
  dailyProfile: '',
  orderFilled: {} as {
    status: ''
    side: ''
    qty: ''
    symbol: ''
    updated_at: ''
    uid: ''
  },
  subscriptionName: '',
  isSubscriptionLoaded: false,
  subFetchLoading: false,
  //// Friends
  friendsList: [],
  searchFriendString: '',
  //// Notifications
  notificationList: [],
  haveNewNotification: false,
  haveNewMessage: false,
  ////
  information: {
    title: '',
    info: '',
    pic: '' as ImageSourcePropType,
  },
}

export type UserAppState = typeof initialState

export const userSlice = createSlice<
  UserAppState,
  {
    setLoading: CaseReducer<
      UserAppState,
      PayloadAction<{ loading: boolean; errorMessage?: string }>
    >
    resetErrorMessage: CaseReducer<UserAppState>
    setUser: CaseReducer<
      UserAppState,
      PayloadAction<{
        user: User
      }>
    >

    uploadProfileImage: CaseReducer<
      UserAppState,
      PayloadAction<{
        profileImage: string
      }>
    >
    updateUserInfo: CaseReducer<
      UserAppState,
      PayloadAction<{
        userInfo: User
      }>
    >
    setAccountPortfolio: CaseReducer<
      UserAppState,
      PayloadAction<{
        portfolio_equity: string
        portfolio_value: string
        long_market_value: string
        cash: string
        buying_power: string
        daytrade_count: number | null
        pattern_day_trader: boolean
      }>
    >
    setAccountHistory: CaseReducer<
      UserAppState,
      PayloadAction<{
        accountHistory: []
      }>
    >
    setPositions: CaseReducer<
      UserAppState,
      PayloadAction<{
        positions: [any]
      }>
    >
    setSubscription: CaseReducer<
      UserAppState,
      PayloadAction<{
        subscription?: string
        isSubscriptionLoaded?: boolean
        subFetchLoading?: boolean
      }>
    >

    setOrders: CaseReducer<
      UserAppState,
      PayloadAction<{
        orders: [any]
      }>
    >
    setActivities: CaseReducer<
      UserAppState,
      PayloadAction<{
        activities: [any]
      }>
    >
    setMarketStatus: CaseReducer<
      UserAppState,
      PayloadAction<{
        marketStatus: boolean
        marketNextClose: Date
        marketNextOpen: Date
      }>
    >
    setStockTicker: CaseReducer<
      UserAppState,
      PayloadAction<{
        stocks: [any]
      }>
    >
    setOnboardingGame: CaseReducer<
      UserAppState,
      PayloadAction<{
        onboardingGame: boolean
      }>
    >
    setToolTip1: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip1: boolean
      }>
    >
    setToolTip2: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip2: boolean
      }>
    >
    setToolTip3: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip3: boolean
      }>
    >
    setToolTip4: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip4: boolean
      }>
    >
    setToolTip5: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip5: boolean
      }>
    >
    setToolTip6: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip6: boolean
      }>
    >
    setToolTip7: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip7: boolean
      }>
    >
    setToolTip8: CaseReducer<
      UserAppState,
      PayloadAction<{
        toolTip8: boolean
      }>
    >
    setDailyProfile: CaseReducer<
      UserAppState,
      PayloadAction<{
        amount: string
      }>
    >
    setOrderFilled: CaseReducer<
      UserAppState,
      PayloadAction<{
        status: ''
        side: ''
        qty: ''
        symbol: ''
        updated_at: ''
        uid: ''
      }>
    >
    setFriendsList: CaseReducer<
      UserAppState,
      PayloadAction<{
        friendsList: []
      }>
    >
    setSearchFriendString: CaseReducer<
      UserAppState,
      PayloadAction<{
        searchString: string
      }>
    >
    setNotificationList: CaseReducer<
      UserAppState,
      PayloadAction<{
        notificationList: []
      }>
    >
    setHaveNewNotification: CaseReducer<
      UserAppState,
      PayloadAction<{
        check: boolean
      }>
    >
    setHaveNewMessage: CaseReducer<
      UserAppState,
      PayloadAction<{
        check: boolean
      }>
    >
    setInformation: CaseReducer<
      UserAppState,
      PayloadAction<{
        infoId: number
      }>
    >
    removeInformation: CaseReducer<UserAppState, PayloadAction>
    setChallengeSent: CaseReducer<
      UserAppState,
      PayloadAction<{
        infoId: number
      }>
    >
    removeChallengeSent: CaseReducer<UserAppState, PayloadAction>
    // setInvestPosition: CaseReducer<
    //   UserAppState,
    //   PayloadAction<{
    //     infoId:number
    //   }>
    // >
    // removeInvestPosition: CaseReducer<
    //   UserAppState,
    //   PayloadAction
    // >
  }
>({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      return {
        ...state,
        loading: payload?.loading,
        errorMessage: payload?.errorMessage || '',
      }
    },
    resetErrorMessage: (state, { payload }) => {
      return {
        ...state,
        errorMessage: '',
      }
    },
    setUser: (state, { payload }) => {
      return {
        ...state,
        user: payload?.user,
        loading: false,
      }
    },

    uploadProfileImage: (state, { payload }) => {
      return {
        ...state,
        user: { ...state.user, profileImage: payload?.profileImage },
        loading: false,
      }
    },
    updateUserInfo: (state, { payload }) => {
      return {
        ...state,
        user: payload?.userInfo,
        loading: false,
      }
    },
    setAccountPortfolio: (state, { payload }) => {
      return {
        ...state,
        portfolio_equity: payload?.portfolio_equity,
        portfolio_value: parseFloat(payload?.portfolio_value)
          ?.toFixed(2)
          ?.toString()
          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          ?.replace(/(\. 0+|0+)$/, '')
          ?.replace(/\.$/, ''),
        long_market_value: payload?.long_market_value,
        cash: payload?.cash,
        buying_power: payload?.buying_power,
        daytrade_count: payload?.daytrade_count,
        pattern_day_trader: payload?.pattern_day_trader,
      }
    },
    setAccountHistory: (state, { payload }) => {
      return {
        ...state,
        accountHistory: payload?.accountHistory,
      }
    },
    setOnboardingGame: (state, { payload }) => {
      return {
        ...state,
        onboardingGame: payload?.onboardingGame,
      }
    },
    setToolTip1: (state, { payload }) => {
      return {
        ...state,
        toolTip1: payload?.toolTip1,
      }
    },
    setToolTip2: (state, { payload }) => {
      return {
        ...state,
        toolTip2: payload?.toolTip2,
      }
    },
    setToolTip3: (state, { payload }) => {
      return {
        ...state,
        toolTip3: payload?.toolTip3,
      }
    },
    setToolTip4: (state, { payload }) => {
      return {
        ...state,
        toolTip4: payload?.toolTip4,
      }
    },
    setToolTip5: (state, { payload }) => {
      return {
        ...state,
        toolTip5: payload?.toolTip5,
      }
    },
    setToolTip6: (state, { payload }) => {
      return {
        ...state,
        toolTip6: payload?.toolTip6,
      }
    },
    setToolTip7: (state, { payload }) => {
      return {
        ...state,
        toolTip7: payload?.toolTip7,
      }
    },
    setToolTip8: (state, { payload }) => {
      return {
        ...state,
        toolTip8: payload?.toolTip8,
      }
    },
    setPositions: (state, { payload }) => {
      return {
        ...state,
        positions: payload?.positions,
      }
    },
    setSubscription: (state, { payload }) => {
      return {
        ...state,
        subscriptionName: payload?.subscription ?? state.subscriptionName,
        isSubscriptionLoaded: payload?.isSubscriptionLoaded ?? state.isSubscriptionLoaded,
        subFetchLoading: payload?.subFetchLoading ?? state.subFetchLoading,
      }
    },

    setOrders: (state, { payload }) => {
      return {
        ...state,
        orders: payload?.orders,
      }
    },
    setActivities: (state, { payload }) => {
      return {
        ...state,
        activities: payload?.activities,
      }
    },
    setMarketStatus: (state, { payload }) => {
      return {
        ...state,
        marketStatus: payload?.marketStatus,
        marketNextOpen: payload?.marketNextOpen,
        marketNextClose: payload?.marketNextClose,
      }
    },
    setStockTicker: (state, { payload }) => {
      return {
        ...state,
        stockTickers: payload?.stocks,
        // .replace('common share', ''),
        // .split('common share')?.join('')
        // .replace('CLASS A', ''),
        // .replace('Ordinary stock', ''),
        // .replace('COMMON SHARES', ''),
        // .replace('Ordinary shares', ''),
      }
    },
    setDailyProfile: (state, { payload }) => {
      return {
        ...state,
        dailyProfile: payload?.amount,
      }
    },
    setOrderFilled: (state, { payload }) => {
      return {
        ...state,
        orderFilled: {
          status: payload?.status,
          side: payload?.side,
          qty: payload?.qty,
          symbol: payload?.symbol,
          updated_at: payload?.updated_at,
          uid: payload?.uid,
        },
      }
    },
    setFriendsList: (state, { payload }) => {
      return {
        ...state,
        friendsList: payload.friendsList,
      }
    },
    setSearchFriendString: (state, { payload }) => {
      return {
        ...state,
        searchFriendString: payload.searchString,
      }
    },
    ////
    setNotificationList: (state, { payload }) => {
      return {
        ...state,
        notificationList: payload.notificationList,
      }
    },
    setHaveNewNotification: (state, { payload }) => {
      return {
        ...state,
        haveNewNotification: payload.check,
      }
    },
    setHaveNewMessage: (state, { payload }) => {
      return {
        ...state,
        haveNewMessage: payload.check,
      }
    },
    setInformation: (state, { payload }) => {
      const infoId = payload.infoId
      const selectedInfo: {
        title: string
        info: string
        pic: ImageSourcePropType
      } = infoText.find(item => item.id === infoId)
      return {
        ...state,
        information: selectedInfo,
      }
    },
    removeInformation: (state, { payload }) => {
      return {
        ...state,
        information: {
          title: '',
          info: '',
          pic: '' as ImageSourcePropType,
        },
      }
    },
    setChallengeSent: (state, { payload }) => {
      const infoId = payload.infoId
      const selectedInfo: {
        title: string
        info: string
        pic: ImageSourcePropType
      } = infoText.find(item => item.id === infoId)
      return {
        ...state,
        information: selectedInfo,
      }
    },
    removeChallengeSent: (state, { payload }) => {
      return {
        ...state,
        information: {
          title: '',
          info: '',
          pic: '' as ImageSourcePropType,
        },
      }
    },
    // setInvestPosition: (state, { payload }) => {
    //   const infoId = payload.infoId
    //     const selectedInfo:{
    //       title:string,
    //       info:string,
    //       pic:ImageSourcePropType
    //     } = infoText.find(item => item.id===infoId)
    //     return {
    //       ...state,
    //       investPosition: selectedInfo,
    //     }
    //   },
    //   removeInvestPosition: (state, { payload }) => {
    //     return {
    //       ...state,
    //       information: {
    //         title:'',
    //         info:'',
    //         pic:'' as ImageSourcePropType
    //       },
    //     }
    //   },
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
})
export const useUserSelector = buildSubStateSelector<UserAppState>(state => state.user)

export const userActions = userSlice.actions
export const userReducer = userSlice.reducer