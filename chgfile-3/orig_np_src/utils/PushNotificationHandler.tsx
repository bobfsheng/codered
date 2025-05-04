import { userActions } from '@store'
import { Dispatch, AnyAction } from 'redux'

const handleOrderFill = (
  pushNotfication: {
    data: any
    notification: { title: any; body: any }
  },
  state: string,
  dispatch: any,
) => {
  if (state === 'active') {
    const { status, side, qty, symbol, updated_at, uid } = pushNotfication.data
    dispatch(
      userActions.setOrderFilled({
        status,
        side,
        qty,
        symbol,
        updated_at,
        uid,
      }),
    )
  }
}

const handleMoneyDaily = (
  pushNotfication: {
    data: any
    notification: { title: any; body: any }
  },
  state: string,
  dispatch: any,
) => {
  if (state === 'active') {
    const { amount } = pushNotfication.data
    dispatch(userActions.setDailyProfile({ amount }))
  }
}
const PushNotificationHandler = (pushNotfication: any, state: string, dispatch: any) => {
  if (pushNotfication.data.type === 'orderFilled') {
    handleOrderFill(pushNotfication, state, dispatch)
  } else if (pushNotfication.data.type === 'moneyDaily') {
    handleMoneyDaily(pushNotfication, state, dispatch)
  }
}

export { PushNotificationHandler }
