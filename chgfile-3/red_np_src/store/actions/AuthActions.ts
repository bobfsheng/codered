import { NavigationService } from '@navigation'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
import {
  checkIfUserNameAvailable,
  localRemoveItem,
  localSaveItem,
  StorageKeys,
} from '@utils'
import axios from 'axios'
import { Dispatch } from 'redux'
import { userActions } from '@store'
import { authActions } from '../reducers/AuthReducers'

export const signUpWithEmailAsync = (
  email: string,
  password: string,
  username: string,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(authActions.setLoading({ loading: true, errorMessage: '' }))
    try {
      await checkIfUserNameAvailable(username)
      await auth().createUserWithEmailAndPassword(email, password)
      NavigationService.navigate('AlpacaAutoRegister', {
        username: username.toLowerCase(),
      })
      dispatch(authActions.setLoading({ loading: false, errorMessage: '' }))
      NavigationService.navigate('AlpacaAutoRegister', {})
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('The email address is already in use')
        dispatch(
          authActions.setLoading({
            loading: false,
            errorMessage: 'The email address is already in use',
          }),
        )
        return
      }
      if (error.code === 'auth/invalid-email') {
        console.log('The email address is invalid.')
        dispatch(
          authActions.setLoading({
            loading: false,
            errorMessage: 'The email address is invalid',
          }),
        )
        return
      }

      dispatch(authActions.setLoading({ loading: false, errorMessage: error.message }))
    }
  }
}

export const signInWithEmailAsync = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(authActions.setLoading({ loading: true }))
    try {
      await auth().signInWithEmailAndPassword(email, password)

      dispatch(authActions.setLoading({ loading: false, errorMessage: '' }))
      NavigationService.reset([
        {
          name: 'BottomTabNavigator',
          params: {
            screen: 'Home',
          },
        },
      ])
    } catch (error: any) {
      console.log('signInWithEmailAsync =>', error.message)
      dispatch(
        authActions.setLoading({ loading: false, errorMessage: 'Incorrect credentials' }),
      )
    }
  }
}
export const signOutAsync = (store: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(authActions.setLoading({ loading: true }))
    try {
      const userInfo = store.getState().auth
      const snapshot = database().ref(`/User/${userInfo?.userId}`).once('value')
      const fcmTokens = (await snapshot)?.val()?.fcmTokens || []
      const newFcmTokens = fcmTokens.filter((item: any) => item !== userInfo.fcmToken)
      await database().ref(`/User/${userInfo?.userId}`).update({
        fcmTokens: newFcmTokens,
      })
      await localRemoveItem(StorageKeys.alpacaToken)
      await auth().signOut()
      dispatch(
        userActions.setSubscription({
          subscription: '',
          isSubscriptionLoaded: true,
        }),
      )
      dispatch(authActions.setAlpaceToken({ alpacaToken: '' }))
      dispatch(
        authActions.setAuth({
          userId: '',
          email: '',
          isLoggedIn: false,
          userName: '',
          userEmoji: '',
          userBio: '',
        }),
      )
      NavigationService.reset([
        {
          name: 'BottomTabNavigator',
          params: {
            screen: 'Home',
          },
        },
      ])
      dispatch(authActions.setLoading({ loading: false, errorMessage: '' }))
    } catch (error: any) {
      console.log('signInWithEmailAsync =>', error.message)
      dispatch(authActions.setLoading({ loading: false, errorMessage: '' }))
    }
  }
}
export const resetPasswordAsync = (email: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(authActions.setLoading({ loading: true }))
    try {
      await auth().sendPasswordResetEmail(email)
      alert(
        "Password reset link has been sent to you email.\n If you don't see it, please check your spam folder.",
      )
      dispatch(
        authActions.setLoading({
          loading: false,
          errorMessage: '',
        }),
      )
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        dispatch(
          authActions.setLoading({
            loading: false,
            errorMessage: 'The email address is invalid',
          }),
        )
        return
      }
      dispatch(authActions.setLoading({ loading: false, errorMessage: '' }))
    }
  }
}
const pushTokenToFB = async (
  access_token: any,
  dataAlpacaEmail: any,
  dataAlpacaPassword: any,
  username: any,
  useremoji: any,
  userbio: any,
) => {
  const authResponse: any = auth()
  if (authResponse?._user) {
    const user = authResponse?._user
    await database().ref(`User/${user.uid}`).set({
      userName: username,
      userEmoji: useremoji,
      userEmail: user.email,
      token: access_token,
      alpacaEmail: dataAlpacaEmail,
      alpacaPassword: dataAlpacaPassword,
      uid: user.uid,
      redCoins: 10000,
      userLevel: 0,
    })
    await firestore().collection('User').doc(user.uid).set({
      userName: username,
      userEmoji: useremoji,
      userBio: userbio,
      userEmail: user.email,
      token: access_token,
      alpacaEmail: dataAlpacaEmail,
      alpacaPassword: dataAlpacaPassword,
      uid: user.uid,
      redCoins: 10000,
      userLevel: 0,
    })
  }
}

// export const alpacaDataRegister = async (store: any) => {
//   console.log('alpacaDataRegister action')
//   try {

//     const tokensCollection = firestore().collection('tokens').limit(1);
//     const tokensz = await firestore().collection('tokens').limit(1).get().then(querySnapshot => {
//       console.log('Total users: ', querySnapshot.size);

//       querySnapshot.forEach(documentSnapshot => {
//         console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
//       });
//     });
//     console.log(tokensCollection, 'leeel')

//     return Promise.resolve(true)
//   } catch (error) {
//     console.log('alpd', error.response)
//     return Promise.reject(false)
//   }
// }
const deleteToken = async key => {
  try {
    await database().ref(`/Tokens/${key}`).set(null)
  } catch (error) {}
}
export const alpacaAutoRegister = async (store: any, username: string) => {
  try {
    const response = await database().ref('Tokens').once('value')
    const totalDocuments = response.numChildren() //get number of tokens
    var randomNr: any = Math.random() * totalDocuments
    var userIndex = parseInt(randomNr, 10) //parse the random number from double to integer
    var currentIndex = 0
    var BreakException = {}

    try {
      response.forEach(function (snap) {
        if (currentIndex == userIndex) {
          let key = snap.key
          let RandomToken = snap.val()
          //Do something with your random user
          pushTokenToFB(
            RandomToken.alpaca_access_token,
            RandomToken.email,
            RandomToken.password,
            username,
            '😁',
            '',
          )
          deleteToken(key)
          localSaveItem(StorageKeys.alpacaToken, RandomToken.alpaca_access_token)
            .then()
            .catch()
          store.dispatch(
            authActions.setAlpaceToken({
              alpacaToken: RandomToken.alpaca_access_token,
            }),
          )
          throw BreakException
        }
        currentIndex++
      })
    } catch (e) {
      if (e !== BreakException) throw e
      return Promise.resolve(true)
    }

    // const response = await axios.post(
    //   'https://pacific-crag-09928.herokuapp.com/create-verify',
    // )

    //HERE KEEP THE POST REQUEST BUT GET A TOKEN, ALPACAMEAIL AND
    //ALPACAPASSWORD FROM THE /TOKENS DATABASE ON FIREBASE & PUSH TO THE USERS DATABASE &
    // THEN DELETE THE USED TOKEN, EMAIL, PW FROM THE TOKENS DATABASE
    // if (response.data) {
    //   pushTokenToFB(
    //     response.data.alpaca_access_token,
    //     response.data.data.email,
    //     response.data.data.password,
    //   )
    //   await localSaveItem(StorageKeys.alpacaToken, response.data.alpaca_access_token)
    //   store.dispatch(
    //     authActions.setAlpaceToken({ alpacaToken: response.data.alpaca_access_token }),
    //   )
    // }
  } catch (error) {
    console.log('alpacaAutoRegister =>', error.response)
    return Promise.reject(false)
  }
}

export const addMoney = async (userId, amount) => {
  // console.log('add money')
  try {
    const snapshot = database().ref(`/User/${userId}`).once('value')
    const userData = (await snapshot)?.val()
    const { alpacaEmail, alpacaPassword } = userData
    const response = await axios.post(
      'https://pacific-crag-09928.herokuapp.com/add-money',
      { amount, email: alpacaEmail, password: alpacaPassword },
    )
    // setMoneyLoading(true)
    if (response.data) {
      console.log('money added successfully', response?.data)
      // setMoneyLoading(false)
      try {
        await database().ref(`/Purchases/${userId}`).update({
          amount,
        })
        await firestore().collection('Purchases').doc(userId).update({
          amount,
        })
      } catch (error) {
        console.log('error =>', error.message)
        throw new Error(error.message ?? 'Something went wrong')
      }
    }
    return Promise.resolve(true)
  } catch (error) {
    console.log('money not added =>', error.response)
    // setMoneyLoadingErrror(true)
    return Promise.reject(false)
  }
}
