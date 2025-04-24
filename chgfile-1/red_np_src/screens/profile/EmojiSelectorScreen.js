import React, { useState } from 'react'
import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { CustomButton } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  updateUserWithEmoji,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { authActions, useAuthSelector, useReduxDispatch } from '@store'
import { useForm } from 'react-hook-form'
import EmojiSelector, { Categories } from 'react-native-emoji-selector'

const EmojiSelectorScreen = () => {
  const dispatch = useReduxDispatch()
  const { userId, userEmoji, isLoggedIn } = useAuthSelector(state => state)
  const [userEmojiSelected, setUserEmojiSelected] = useState('')
  const [userEmojiLoading, setUserEmojiLoading] = useState(false)
  const onSubmit = async data => {
    const { userEmoji } = data
    try {
      setUserEmojiLoading(true)
      // await checkIfuserEmojiAvailable(userEmoji)
      await updateUserWithEmoji(userId, userEmojiSelected)
      dispatch(authActions.setUserEmoji({ userEmoji: userEmojiSelected }))
      setUserEmojiLoading(false)
      NavigationService.navigate('Profile')
    } catch (error) {
      setUserEmojiLoading(false)
      console.log('error', error)
      if (error?.message === 'User name already exists') {
        Alert.alert('User Name', 'User name already exists')
      } else {
      }
    }
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({})

  // console.log(userEmojiSelected)
  return (
    <SafeAreaView style={styles.mainView}>
      {userEmojiLoading && (
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0,0.3)',
            height: '100%',
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={'#B9D094'} />
        </View>
      )}
      <View
        style={{
          borderColor: 'white',
          borderWidth: heightPercentageToDP(0.2),
          width: widthPercentageToDP(30),
          height: widthPercentageToDP(30),
          borderRadius: widthPercentageToDP(2),
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginVertical: heightPercentageToDP(3),
        }}>
        <Text style={[styles.userEmojiText]}>{userEmojiSelected}</Text>
      </View>

      <EmojiSelector
        // placeholder
        showSectionTitles={false}
        searchbarContainerStyle={{ color: 'black', backgroundColor: 'black' }}
        // categoryButtonStyle
        searchbarStyle={{ color: 'black', backgroundColor: 'black' }}
        onEmojiSelected={emoji => setUserEmojiSelected(emoji)}
      />
      {Platform.OS === 'android' ? (
        <View
          style={{
            position: 'absolute',
            borderColor: 'white',
            borderTopWidth: heightPercentageToDP(0.1),
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: heightPercentageToDP(67),
            width: widthPercentageToDP(100),
            height: heightPercentageToDP(14),
            backgroundColor: colors.darkBackground,
          }}>
          <CustomButton
            primary={userEmojiSelected !== '' ? true : false}
            disabled={userEmojiSelected !== '' ? false : true}
            style={{ alignSelf: 'center' }}
            text="Continue"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            borderColor: 'white',
            borderTopWidth: heightPercentageToDP(0.1),
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: heightPercentageToDP(Platform.isPad === true ? 53 : 64),
            width: widthPercentageToDP(100),
            height: heightPercentageToDP(14),
            backgroundColor: colors.darkBackground,
          }}>
          <CustomButton
            primary={userEmojiSelected !== '' ? true : false}
            disabled={userEmojiSelected !== '' ? false : true}
            style={{ alignSelf: 'center' }}
            text="Continue"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainView: { paddingTop: 25, flex: 1, backgroundColor: colors.darkBackground },
  tickerContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    borderRadius: widthPercentageToDP(2),
    borderWidth: widthPercentageToDP(0.3),
  },
  userEmojiText: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(13),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  balanceText: [
    textStyles.bigBold,
    {
      color: colors.primary2,
      fontSize: actuatedNormalize(18),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  freeBox: {
    width: widthPercentageToDP(90),
    height: widthPercentageToDP(12),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(1),
    borderRadius: 10,
    paddingHorizontal: widthPercentageToDP(1),
    paddingVertical: heightPercentageToDP(1),
  },
  userEmojiText: [
    {
      color: 'white',
      fontSize: actuatedNormalize(50),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      marginBottom: heightPercentageToDP(2),
      marginTop: heightPercentageToDP(2),
      textAlign: 'center',
    },
  ],
})
export { EmojiSelectorScreen }
