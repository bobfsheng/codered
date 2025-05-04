import React, { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  KeyboardAvoidingView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { useForm } from 'react-hook-form'
import {
  colors,
  heightPercentageToDP,
  SIGNUP_SCHEMA,
  textStyles,
  widthPercentageToDP,
  updateReferrerWithCoins,
} from '@utils'
import {
  CustomButton,
  EmailInput,
  UserNameInput,
  ErrorModal,
  HorizontalRule,
  PasswordInput,
  Spacer,
  Icon,
  AdComponent,
} from '@components'
import { NavigationService } from '@navigation'
import {
  authActions,
  signUpWithEmailAsync,
  useAuthSelector,
  useReduxDispatch,
} from '@store'
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication'
import auth from '@react-native-firebase/auth'
import firebase from '@react-native-firebase/app'
import Video from 'react-native-video'

const googleLogo = require('@assets/Google_G_Logo.png')
const facebookLogo = require('@assets/Facebook_F_Logo.png')
// const videoBackground = require('@assets/video_5.mov')
const title = require('@assets/images/signup/SignUp.png')
const SignUpScreen = ({ route }) => {
  const referrerId = route?.params?.referrerId || null
  const dispatch = useReduxDispatch()
  const { errorMessage } = useAuthSelector(state => state)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({})
  useFocusEffect(useCallback(reset))

  const handleAppleSignIn = async () => {
    console.log('pressed')
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN, // Changed from CREATE to LOGIN
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME], // Changed Operation to Scope
      })

      const { identityToken, user, email } = appleAuthRequestResponse
      const credential = firebase.auth.AppleAuthProvider.credential(identityToken)

      const userCredential = await auth().signInWithCredential(credential)

      if (userCredential.additionalUserInfo?.isNewUser) {
        const userInfo = {
          email: email,
          appleId: user,
          userName: userCredential.user.displayName || '',
        }

        await firestore().collection('User').doc(userCredential.user.uid).set(userInfo)
      }
    } catch (error) {
      console.log(error)
      return
    }
  }

  const onSubmit = async data => {
    const {
      email,
      password,
      username,
      // confirmPassword
    } = data

    if (referrerId && referrerId !== 'null') {
      try {
        await updateReferrerWithCoins(referrerId, 1000) // Update the referrer's redCoins
      } catch (error) {
        console.error('Failed to update referrer with coins:', error.message)
        dispatch(
          authActions.setLoading({
            loading: false,
            errorMessage: "Error updating referrer's coins.",
          }),
        )
        return
      }
    }
    dispatch(signUpWithEmailAsync(email, password, username))
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.darkBackground,
        minHeight: Math.round(Dimensions.get('window').height / 2),
      }}>
      {/* <Video
        source={videoBackground}
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat
      /> */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignSelf: 'flex-start',
          }}>
          <Text
            style={[
              textStyles.hugeRegular,
              {
                marginTop: heightPercentageToDP(5),
                marginBottom: heightPercentageToDP(2),
                color: 'white',
              },
            ]}>
            Sign Up
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'position'}
          keyboardVerticalOffset={-240}
          contentContainerStyle={{ flex: 1, alignItems: 'center' }}
          style={{ flex: 1, alignItems: 'center' }}>
          <Spacer height={0} />
          <UserNameInput control={control} errors={errors} />
          <EmailInput control={control} errors={errors} />
          <PasswordInput control={control} errors={errors} />
          {/* <PasswordInput
            control={control}
            errors={errors}
            input={{ name: 'confirmPassword', label: 'Confirm Password' }}
          /> */}
          <Spacer height={0} />
          <CustomButton primary text="Sign Up" onPress={handleSubmit(onSubmit)} />
          <Spacer height={1} />
          <View style={styles.orContainer}>
            <HorizontalRule />
            <Text style={[textStyles.bigRegular, styles.orText]}>or</Text>
            <HorizontalRule />
          </View>
          <Spacer height={0.5} />
          {/* <CustomButton
            icon={facebookLogo}
            text="Continue with Facebook"
            onPress={() => console.log('Login with Facebook')}
          />
          <CustomButton
            icon={googleLogo}
            text="Continue with Google"
            onPress={() =>
              onGoogleButtonPress().then(() => console.log('Signed in with Google!'))
            }
          /> */}
          {/* {Platform.OS === 'ios' && (
            <AppleButton
              buttonStyle={AppleButton.Style.WHITE}
              buttonType={AppleButton.Type.CONTINUE}
              style={{
                marginTop: heightPercentageToDP(1),
                width: widthPercentageToDP(65), // You must specify a width
                height: heightPercentageToDP(5), // You must specify a height
              }}
              onPress={handleAppleSignIn}
            />
          )} */}

          <View style={[styles.bottomButtons]}>
            <Text style={[textStyles.smallRegular, { color: colors.offWhite }]}>
              Already have an account?
            </Text>
            <Pressable onPress={() => NavigationService.navigate('SignInScreen')}>
              <Text
                style={[
                  textStyles.bigRegular,
                  {
                    color: colors.primary,
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}>
                SIGN IN
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {!!errorMessage && (
        <ErrorModal
          errorMessage={errorMessage}
          visible={!!errorMessage}
          handleCloseModal={() => dispatch(authActions.resetErrorMessage())}
        />
      )}
      <AdComponent />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    position: 'relative',
    left: widthPercentageToDP(2),
    top: heightPercentageToDP(2),
  },
  orContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(90),
  },
  orText: {
    color: colors.mediumGrey,
    paddingHorizontal: widthPercentageToDP(4),
  },
  bottomButtons: {
    marginTop: heightPercentageToDP(3),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})

export { SignUpScreen }
