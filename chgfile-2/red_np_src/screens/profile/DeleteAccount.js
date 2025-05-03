import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  PASSWORD_SCHEMA,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CustomButton, CustomLoader, ErrorModal, PasswordInput } from '@components'
import { useFocusEffect } from '@react-navigation/native'
import auth, { firebase } from '@react-native-firebase/auth'
import store, { signOutAsync, useReduxDispatch } from '@store'

const DeleteAccount = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PASSWORD_SCHEMA),
  })
  useFocusEffect(useCallback(reset))
  const dispatch = useReduxDispatch()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  const onSubmit = async ({ password }) => {
    setLoading(true)
    const user = firebase.auth().currentUser
    const provider = firebase.auth.EmailAuthProvider
    const authCredential = provider.credential(user.email, password)

    try {
      const authResponse = await user.reauthenticateWithCredential(authCredential)
      const deleteRes = await user.delete()
      dispatch(signOutAsync(store))
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log('error', error.message)
      setErrorMessage('Incorrect password')
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: widthPercentageToDP(2),
          alignItems: 'center',
          marginTop: heightPercentageToDP(5),
        }}>
        <Text
          style={[
            textStyles.bigRegular,
            {
              marginLeft: widthPercentageToDP(2),
              marginBottom: heightPercentageToDP(3),
              fontSize: actuatedNormalize(15),
              color: 'white',
            },
          ]}>
          Are you sure you would like to delete your account? This action cannot be
          undone.
        </Text>

        <PasswordInput control={control} errors={errors} />

        <CustomButton
          primary
          text="Delete"
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: heightPercentageToDP(2) }}
        />
      </ScrollView>
      {!!errorMessage && (
        <ErrorModal
          visible={!!errorMessage}
          errorMessage={errorMessage}
          handleCloseModal={() => {
            setErrorMessage('')
          }}
        />
      )}
      {loading && <CustomLoader loading={loading} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingTop: 25, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(0),
  },
})

export { DeleteAccount }
