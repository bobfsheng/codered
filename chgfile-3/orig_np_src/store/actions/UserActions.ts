import { Linking } from 'react-native'

import { userActions } from '@store'
import { Dispatch } from 'redux'
import {
  cancelOrder,
  getAccount,
  getActivities,
  getAssets,
  getClock,
  getLastQuote,
  getOrders,
  getPortfolioHistory,
  getPositions,
  // getNotificationsUrl,
} from '@services'
import axios from 'axios'
import { validationServer } from '@hooks'

export const getUser = () => {
  return (dispatch: Dispatch) => {
    dispatch(userActions.setLoading({ loading: true }))
    // const url = getUserInfoUrl
    // axiosInstance
    //   .get(url)
    //   .then(res => {
    //     setUserSuccess(dispatch, res.data)
    //   })
    //   .catch(error => {
    //     errorToast(error)
    //     dispatch(userActions.setLoading({ loading: false }))
    //   })
  }
}
const setUserSuccess = (dispatch: Dispatch, data: any) => {
  dispatch(
    userActions.setUser({
      user: data.data.user,
    }),
  )
}

export const getAccountPortfolio = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response: any = await getAccount()
      if (response.status === 200) {
        const {
          equity,
          long_market_value,
          portfolio_value,
          cash,
          buying_power,
          daytrade_count,
          pattern_day_trader,
        } = response.data
        dispatch(
          userActions.setAccountPortfolio({
            portfolio_value,
            portfolio_equity: equity,
            long_market_value,
            cash,
            buying_power,
            daytrade_count,
            pattern_day_trader,
          }),
        )
      }
    } catch (error) {
      console.log('getAccountportfolio actions =>', error)
    }
  }
}

export const getAccountHistory = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getPortfolioHistory()
      if (response.status === 200) {
        dispatch(
          userActions.setAccountHistory({
            accountHistory: response.data.equity,
          }),
        )
      }
    } catch (error) {
      console.log('getAccountHistory actions =>', error)
    }
  }
}
export const getAccountPositions = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getPositions()
      if (response.status === 200) {
        dispatch(
          userActions.setPositions({
            positions: response.data,
          }),
        )
      }
    } catch (error) {
      console.log('getAccountPositions actions =>', error)
    }
  }
}
export const getAccountOrders = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getOrders()
      if (response.status === 200) {
        dispatch(
          userActions.setOrders({
            orders: response.data,
          }),
        )
      }
    } catch (error) {
      console.log('getAccountOrders actions =>', error)
    }
  }
}
export const getAccountActivities = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getActivities()
      if (response.status === 200) {
        dispatch(
          userActions.setActivities({
            activities: response.data,
          }),
        )
      }
    } catch (error) {
      console.log('getAccountActivities actions =>', error)
    }
  }
}

export const cancelOrderWithId = (orderId: string) => {
  return async (dispatch: any) => {
    try {
      const response = await cancelOrder(orderId)
      if (response.status === 204) {
        dispatch(getAccountOrders())
      }
    } catch (error) {
      console.log('getAccountActivities actions =>', error)
    }
  }
}

export const getMarketStatus = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getClock()
      if (response.status === 200) {
        dispatch(
          userActions.setMarketStatus({
            marketStatus: response.data.is_open,
            marketNextClose: response.data.next_close,
            marketNextOpen: response.data.next_open,
          }),
        )
      }
    } catch (error) {
      console.log('getMarketStatus actions =>', error)
    }
  }
}

export const getStockTickers = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getAssets()
      if (response.status === 200) {
        dispatch(
          userActions.setStockTicker({
            stocks: response.data,
          }),
        )
      }
    } catch (error) {
      console.log('getStockTickers actions =>', error)
    }
  }
}

export const getCurrentSubscription = (userId: string) => {
  // console.log(userId,'userID1')
  return async (dispatch: Dispatch) => {
    try {
      // console.log(userId,'userID')
      const {
        data: { hasSubscription, subscription },
      } = await axios.get(`${validationServer}/iap/getSubscription/${userId}`)
      dispatch(
        userActions.setSubscription({
          subscription: hasSubscription === true ? subscription?.productId : '',
          isSubscriptionLoaded: true,
        }),
      )
    } catch (error) {
      console.log('getCurrentSubscription actions =>', error)
      dispatch(
        userActions.setSubscription({
          subscription: '',
          isSubscriptionLoaded: true,
        }),
      )
    }
  }
}

// export const getQuizLevel = (quiz: string) => {
//   // console.log(userId,'userID1')
//   return async (dispatch: Dispatch) => {
//       dispatch(
//         userActions.setQuizLevel({
//           quiz
//         }),
//       )
//     }
//   }

export const getOnboardingGame = (onboardingGame: boolean) => {
  // console.log(userId,'userID1')
  return async (dispatch: Dispatch) => {
    dispatch(
      userActions.setOnboardingGame({
        onboardingGame,
      }),
    )
  }
}
export const getToolTip1 = (toolTip1: boolean) => {
  // console.log(userId,'userID1')
  return async (dispatch: Dispatch) => {
      dispatch(
        userActions.setToolTip1({
          toolTip1
        }),
      )
    }
  }

  export const getToolTip2 = (toolTip2: boolean) => {
    // console.log(userId,'userID1')
    return async (dispatch: Dispatch) => {
        dispatch(
          userActions.setToolTip2({
            toolTip2,
          }),
        )
      }
    }

    export const getToolTip3 = (toolTip3: boolean) => {
      // console.log(userId,'userID1')
      return async (dispatch: Dispatch) => {
          dispatch(
            userActions.setToolTip3({
              toolTip3
            }),
          )
        }
      }
    
      export const getToolTip4 = (toolTip4: boolean) => {
        // console.log(userId,'userID1')
        return async (dispatch: Dispatch) => {
            dispatch(
              userActions.setToolTip4({
                toolTip4
              }),
            )
          }
        }

        export const getToolTip5 = (toolTip5: boolean) => {
          // console.log(userId,'userID1')
          return async (dispatch: Dispatch) => {
              dispatch(
                userActions.setToolTip5({
                  toolTip5
                }),
              )
            }
          }

          export const getToolTip6 = (toolTip6: boolean) => {
            // console.log(userId,'userID1')
            return async (dispatch: Dispatch) => {
                dispatch(
                  userActions.setToolTip6({
                    toolTip6
                  }),
                )
              }
            }
            export const getToolTip7 = (toolTip7: boolean) => {
              // console.log(userId,'userID1')
              return async (dispatch: Dispatch) => {
                  dispatch(
                    userActions.setToolTip7({
                      toolTip7
                    }),
                  )
                }
              }
    
              export const getToolTip8 = (toolTip8: boolean) => {
                // console.log(userId,'userID1')
                return async (dispatch: Dispatch) => {
                    dispatch(
                      userActions.setToolTip8({
                        toolTip8
                      }),
                    )
                  }
                }



      

// export const getNotification = (pageNo?: number) => {
//   return async (dispatch: any) => {
//     dispatch(userActions.setLoading({ loading: true }))
//     const url = getNotificationsUrl
//     return axiosInstance
//       .get(url)
//       .then(res => {
//         dispatch(
//           userActions.getNotifications({
//             notifications: res.data.data.notifications,
//           }),
//         )
//       })
//       .catch(error => {
//         console.log('error', error)
//         dispatch(userActions.setLoading({ loading: false }))
//       })
//   }
// }
