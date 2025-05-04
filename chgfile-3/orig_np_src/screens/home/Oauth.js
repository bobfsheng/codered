import React, { useEffect } from 'react'
import { Button, Alert, Linking, View } from 'react-native'
import axios from 'axios'

// Import your funFacts constant here

const Oauth = () => {
  useEffect(() => {
    const handleOpenURL = async event => {
      if (event.url.startsWith('myapp://')) {
        const code = new URL(event.url).searchParams.get('code')
        if (code) {
          try {
            const response = await axios.post('https://api.alpaca.markets/oauth/token', {
              grant_type: 'authorization_code',
              code: code,
              client_id:"94d032e19c81da71ccbc1f1e881d85fb",
              client_secret: "bfd54db2b9e335a386e03f0f186e9cf4910319c9",
              redirect_uri: 'myapp://', // your custom URL scheme
            })

            const accessToken = response.data.access_token
            // await AsyncStorage.setItem('accessToken', accessToken)
            console.log('accessToken', accessToken)

            Alert.alert('Success', 'Authenticated with Alpaca!')
          } catch (error) {
            Alert.alert('Error', 'Error during authentication')
          }
        }
      }
    }

    // Add event listener
    Linking.addEventListener('url', handleOpenURL)

    return () => {
      // Remove event listener on cleanup
      Linking.removeEventListener('url', handleOpenURL)
    }
  }, [])

  const authenticateWithAlpaca = () => {
    const authURL = `https://app.alpaca.markets/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=myapp://&scope=account:write%20trading`
    Linking.openURL(authURL)
  }
  
  return (
    <View style={{flex:1, paddingTop:100}}>
      <Button title="Authenticate with Alpaca" onPress={authenticateWithAlpaca} />
    </View>
  )
}


export { Oauth }
