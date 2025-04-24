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
import {
  colors,
  heightPercentageToDP,
  SIGNIN_SCHEMA,
  widthPercentageToDP,
  textStyles,
} from '@utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  authActions,
  signInWithEmailAsync,
  useAuthSelector,
  useReduxDispatch,
} from '@store'
import {
  CustomButton,
  EmailInput,
  ErrorModal,
  HorizontalRule,
  PasswordInput,
  Spacer,
  AdComponent,
} from '@components'
import { NavigationService } from '@navigation'
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
const SignInScreen = ({ navigation }) => {
  const dispatch = useReduxDispatch()
  const { errorMessage } = useAuthSelector(state => state)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SIGNIN_SCHEMA),
  })

  useFocusEffect(useCallback(reset))
  const onSubmit = data => {
    const { email, password } = data
    dispatch(signInWithEmailAsync(email, password))
  }

  const handleAppleSignIn = async () => {
    try {
      // start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
      })

      // create a Firebase credential from the Apple identity token
      const { identityToken } = appleAuthRequestResponse
      const credential = firebase.auth.AppleAuthProvider.credential(identityToken)

      // sign in to Firebase with the credential
      const userCredential = await auth().signInWithCredential(credential)
    } catch (error) {
      console.log(error)
  return;
    }
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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
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
            Sign In
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'position'}
          keyboardVerticalOffset={-240}
          contentContainerStyle={{ flex: 1, alignItems: 'center' }}
          style={{ flex: 1, alignItems: 'center' }}>
          <Spacer height={1} />
          <EmailInput control={control} errors={errors} />
          <PasswordInput
            control={control}
            errors={errors}
            forgotPassword={() => NavigationService.navigate('ResetPasswordScreen')}
            signUp={false}
          />
          <Spacer height={3} />

          <CustomButton primary text="Sign In" onPress={handleSubmit(onSubmit)} />

          <Spacer height={3} />
          <View style={styles.orContainer}>
            <HorizontalRule />
            <Text style={[textStyles.bigRegular, styles.orText]}>or</Text>
            <HorizontalRule />
          </View>
          <Spacer height={2} />
          {/* {Platform.OS === 'ios' && 
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              marginTop: heightPercentageToDP(1),
              width: widthPercentageToDP(65), // You must specify a width
              height: heightPercentageToDP(5), // You must specify a height
            }}
            onPress={handleAppleSignIn}
      />
          } */}

          {/* <CustomButton
            icon={facebookLogo}
            text="Continue with Facebook"
            onPress={() => {}}
          />

          <CustomButton
            icon={googleLogo}
            text="Continue with Google"
            onPress={() => {}}
          /> */}
          <View style={[styles.buttomButtons, { marginTop: heightPercentageToDP(2) }]}>
            <Text style={[textStyles.smallRegular, { color: colors.offWhite }]}>
              Don't have an account yet?
            </Text>
            <Pressable onPress={() => NavigationService.navigate('SignUpScreen')}>
              <Text
                style={[
                  textStyles.bigRegular,
                  { color: colors.primary, marginLeft: widthPercentageToDP(2) },
                ]}>
                CREATE ACCOUNT
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
  buttomButtons: {
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

export { SignInScreen }
