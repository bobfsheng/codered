import React, { useState } from 'react'
import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { CustomButton } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  updateUserWithBio,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { authActions, useAuthSelector, useReduxDispatch } from '@store'
import { useForm } from 'react-hook-form'

const BioEditorScreen = () => {
  const dispatch = useReduxDispatch()
  const { userId, userBio } = useAuthSelector(state => state)
  const [userBioSelected, setUserBioSelected] = useState(
    userBio !== undefined ? userBio : '',
  )
  const [userEmojiLoading, setUserEmojiLoading] = useState(false)
  const onSubmit = async data => {
    const { userBio } = data
    try {
      setUserEmojiLoading(true)
      // await checkIfuserEmojiAvailable(userEmoji)
      await updateUserWithBio(userId, userBioSelected)
      dispatch(authActions.setUserBio({ userBio: userBioSelected }))
      setUserEmojiLoading(false)
      NavigationService.navigate('Profile')
    } catch (error) {
      setUserEmojiLoading(false)
      console.log('error', error)
    }
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({})

  return (
    <SafeAreaView style={styles.mainView}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}>
        <View>
          <Text
            style={[
              textStyles.bigMedium,
              {
                fontSize: actuatedNormalize(15),
                color: 'white',
                paddingHorizontal: widthPercentageToDP(3),
                marginTop: heightPercentageToDP(8),
                alignSelf: 'center',
              },
            ]}>
            Type a fun user bio for yourself. Other users will see this in your profile.
          </Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              textAlign="left"
              style={styles.textinputSyles}
              // value={userBio}
              maxLength={100}
              multiline={true}
              onChangeText={text => setUserBioSelected(text)}
              placeholder={userBio}
              placeholderTextColor={'gray'}
            />
          </View>
          <Text
            style={[
              textStyles.bigMedium,
              {
                fontSize: actuatedNormalize(10),
                color: 'gray',
                marginTop: heightPercentageToDP(0.5),
                marginRight: widthPercentageToDP(8),
                alignSelf: 'flex-end',
              },
            ]}>
            Maximum 100 characters
          </Text>
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
                primary={userBioSelected !== '' ? true : false}
                disabled={userBioSelected !== '' ? false : true}
                style={{ alignSelf: 'center' }}
                text="Save"
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
                marginTop: heightPercentageToDP(Platform.isPad === true ? 55 : 66),
                width: widthPercentageToDP(100),
                height: heightPercentageToDP(14),
                backgroundColor: colors.darkBackground,
              }}>
              <CustomButton
                primary={userBioSelected !== '' ? true : false}
                disabled={userBioSelected !== '' ? false : true}
                style={{ alignSelf: 'center' }}
                text="Save"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainView: {
    paddingTop: 25,
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
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
  textInputContainer: {
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(6),
    marginTop: heightPercentageToDP(0.5),
    backgroundColor: '#474747',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  textInput: {
    width: widthPercentageToDP(90),
    height: '100%',
    justifyContent: 'center',
  },
  textInputWrapper: {
    // justifyContent: 'center',
    // alignContent:'center',
    alignItems: 'flex-start',
    padding: heightPercentageToDP(2.5),
    alignSelf: 'center',
    backgroundColor: '#474747',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(25),
    borderRadius: heightPercentageToDP(Platform.isPad === true ? 0.5 : 1.5),
    marginTop: heightPercentageToDP(3),
  },
  textinputSyles: {
    color: 'white',
    fontSize: actuatedNormalize(15),
    fontFamily: 'DMSans-Medium',
    width: widthPercentageToDP(80),
  },
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
export { BioEditorScreen }
