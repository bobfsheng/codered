import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  ActivityIndicator,
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import {
  Icon,
  CustomButton,
  SecretCodeInput,
} from '@components'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  colors,
  checkGameParticipation,
} from '@utils'
import { NavigationService } from '@navigation'
import { authActions, useAuthSelector, useReduxDispatch, useUserSelector } from '@store'
import { Controller, useForm } from 'react-hook-form'


const InputModal = ({ isVisible, setIsVisible }) => {
  const dispatch = useReduxDispatch()
  const { userId, isLoggedIn } = useAuthSelector(state => state)

  const [isLoading, setIsLoading] = useState(false)
  const [userNameLoading, setUserNameLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      secretCode: '',
    },
  })

const checkIfSecretCodeExists = async secretCode => {
  const docRef = firestore().collection('Games').doc(secretCode)
  const doc = await docRef.get()
  console.log({ doc })

  // Check if the document exists
  if (doc.exists) {
    // Extract the gameType field from the document
    const gameType = doc.data().gameType
    console.log({ gameType })
    // Return both the existence of the document and the gameType
    return { exists: true, gameType }
  } else {
    // Return exists as false and gameType as undefined if the document does not exist
    return { exists: false, gameType: undefined }
  }
}

 

const onSubmit = async data => {
  const { secretCode } = data
  setIsLoading(true)
  // Destructure the response to get the 'exists' and 'gameType' directly
  const { exists, gameType } = await checkIfSecretCodeExists(secretCode?.toUpperCase())
  setIsLoading(false)

  // Now 'exists' is used correctly
  if (exists) {
    setIsVisible(false)
    const userHasParticipated = await checkGameParticipation(
      userId,
      secretCode.toUpperCase(),
    )

    // This check seems redundant, as you're already inside the 'if (exists)' block
    // You might want to navigate based on 'gameType' instead of checking 'exists' again
    if (userHasParticipated) {
      NavigationService.navigate('GameLeaderboard', {
        secretCode: secretCode.toUpperCase(),
      })
    } else {
      // Ensure navigation is conditional based on 'gameType', not 'exists'
      if (gameType === 'buyorsell') {
        NavigationService.navigate('BuyorSell', {
          secretCode: secretCode.toUpperCase(),
        })
      } else {
        NavigationService.navigate('QuizCategory', {
          secretCode: secretCode.toUpperCase(),
          categoryParam: 'Game',
        })
      }
    }
  } else {
    setErrorMessage(true)
  }
}



  return (
    <Modal
      animationType={'fade'} // fade, none, slide
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}>
      <View style={[styles.modalOverlay]}>
        <View style={[styles.container]}>
          <View style={{ padding: widthPercentageToDP(5) }}>
            <Icon
              type="Ionicons"
              name={'close'}
              onPress={() => setIsVisible(false)}
              size={widthPercentageToDP(5)}
              color="black"
              style={{
                alignSelf: 'flex-end',
              }}
            />
            <Text style={[styles.userNameText]}>Enter your secret code</Text>
            <SecretCodeInput
              control={control}
              errors={errors}
              style={{
                width: widthPercentageToDP(58),
                height: heightPercentageToDP(4.5),
                backgroundColor: 'rgba(0,0,0,.2)',
                borderRadius: 10,
                paddingHorizontal: '3%',
              }}
              textStyle={{ color: 'black' }}
              loading={true}
            />
            {(errorMessage===true) && <Text style={[styles.errorText]}>The secret code doesn't exist, please check again. </Text>}
            <CustomButton
              primary
              outline
              text="Enter"
              onPress={handleSubmit(onSubmit)}
              style={{
                width: widthPercentageToDP(58),
                height: heightPercentageToDP(4.5),
              }}
            />
          </View>
          {userNameLoading && (
            <View style={[styles.loading]}>
              <ActivityIndicator color={'#B9D094'} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0,0.87)',
    height: heightPercentageToDP(100),
    width: widthPercentageToDP(100),
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  container: {
    backgroundColor: 'white',
    width: widthPercentageToDP(70),
    alignSelf: 'center',
    borderRadius: widthPercentageToDP(2),
  },
  loading: {
    backgroundColor: 'rgba(0, 0, 0,0.3)',
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameText: [
    textStyles.bigSemiBold,
    {
      color: 'black',
      fontSize: actuatedNormalize(13),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  errorText: [
    textStyles.bigSemiBold,
    {
      color: colors.redError,
      fontSize: actuatedNormalize(11),
      textAlign:'center'
      // marginBottom: heightPercentageToDP(2),
    },
  ],
})

export { InputModal }
