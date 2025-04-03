import { User } from '@models'
import { ImageSourcePropType } from 'react-native'

declare global {
  interface RootState {
    auth: AuthState
    user: UserState
  }
  interface AuthState {
    loading: boolean
    userId: string
    email: string
    userName: string
    userEmoji: string
    weeklyRank: number
    userLevel: { [category: string]: number }
    userSwipe: number
    userBio: string
    redCoins: number
    alpacaToken: string
    isLoggedIn: boolean
    errorMessage: string
    fcmToken: string
  }
  interface UserState {
    loading: boolean
    user: User
    errorMessage: string
    accountHistory: []
    portfolio_equity: string | null
    portfolio_value: string | null
    positions: [any] | []
    orders: [any] | []
    activities: [any] | []
    long_market_value: string
    cash: string
    buying_power: string
    daytrade_count: number | null
    pattern_day_trader: boolean
    stockTickers: [any] | []
    //////
    marketStatus: boolean
    marketNextClose: Date | null
    marketNextOpen: Date | null
    //////
    dailyProfile: string
    orderFilled: {
      status: string
      side: string
      qty: string
      symbol: string
      updated_at: string
      uid: string
    }
    /////
    subscriptionName: string
    isSubscriptionLoaded: boolean
    subFetchLoading: boolean
    /////
    onboardingGame: boolean
    toolTip1: boolean
    toolTip2: boolean
    toolTip3: boolean
    toolTip4: boolean
    toolTip5: boolean
    toolTip6: boolean
    toolTip7: boolean
    toolTip8: boolean
    /////
    friendsList: any[]
    searchFriendString: string
    /////
    notificationList: any[]
    haveNewNotification: boolean
    haveNewMessage: boolean
    ///
    // quiz: string
    ///
    information: {
      title: string
      info: string
      pic: ImageSourcePropType
    }
  }
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export { RootState, UserState }
