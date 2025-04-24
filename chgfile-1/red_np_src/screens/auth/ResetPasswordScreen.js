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
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { NavigationService } from '@navigation'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  colors,
  EMAIL_SCHEMA,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import {
  CustomButton,
  EmailInput,
  ErrorModal,
  HorizontalRule,
  Spacer,
  AdComponent,
} from '@components'
import {
  authActions,
  resetPasswordAsync,
  useAuthSelector,
  useReduxDispatch,
} from '@store'
import Video from 'react-native-video'

// const videoBackground = require('@assets/video_5.mov')
const ResetPasswordScreen = ({}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EMAIL_SCHEMA),
  })
  useFocusEffect(useCallback(reset))
  const dispatch = useReduxDispatch()
  const { errorMessage } = useAuthSelector(state => state)
  const onSubmit = ({ email }) => {
    dispatch(resetPasswordAsync(email))
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
        style={{ height: '200%', flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'position'}
          keyboardVerticalOffset={-240}
          contentContainerStyle={{ flex: 1, alignItems: 'center' }}
          style={{ flex: 1, alignItems: 'center' }}>
          <Spacer height={5} />
          <EmailInput control={control} errors={errors} />

          <Spacer height={0} />
          <CustomButton primary text="Recover" onPress={handleSubmit(onSubmit)} />
          <Spacer height={1} />
          <View style={styles.orContainer}>
            <HorizontalRule />

            <Text style={[textStyles.bigRegular, styles.orText]}>or</Text>
            <HorizontalRule />
          </View>
          <Spacer height={0} />

          <View style={[styles.buttomButtons, { marginBottom: '0%' }]}>
            <Text style={[textStyles.smallRegular, { color: colors.offWhite }]}>
              Don't have an account yet?
            </Text>
            <Pressable
              onPress={() =>
                NavigationService.navigate('Account', { screen: 'SignUpScreen' })
              }>
              <Text
                style={[
                  textStyles.bigRegular,
                  { color: colors.primary, marginBottom: '20%' },
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

export { ResetPasswordScreen }
