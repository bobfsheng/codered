import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { NavigationService, Root } from '@navigation'
import store from '@store'
import { NavigationContainer } from '@react-navigation/native'
import firebase from 'firebase'
import messaging from '@react-native-firebase/messaging'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const firebaseConfig = {
  apiKey: 'AIzaSyBbELocxybHPNIvOvKhoHBUZxTlNtOTQuM',
  authDomain: 'redvest-48588.firebaseapp.com',
  databaseURL: 'https://redvest-48588-default-rtdb.firebaseio.com',
  projectId: 'redvest-48588',
  storageBucket: 'redvest-48588.appspot.com',
  messagingSenderId: '651982342789',
  appId: '1:651982342789:web:399220ff400e2e030c37ec',
  measurementId: 'G-R3FF3VQ1JE',
}

const App: React.FC = () => {
  // Initialize Firebase if not initialized
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Message received in the foreground!', remoteMessage)
      // Dispatch an action to save your message in the Redux store.
      store.dispatch({ type: 'NEW_MESSAGE', payload: remoteMessage })
    })

    // Cleanup the messaging listener on component unmount
    return unsubscribe
  }, [])
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef)
          }}>
          <Root />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  )
}

export default App