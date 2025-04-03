import React from 'react'
import { View, Text } from 'react-native'
import { heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { CustomButton, CustomModal } from '@components'

const ErrorModal = ({ visible, handleCloseModal, errorMessage }) => {
  return (
    <CustomModal
      visible={visible}
      handleCloseModal={handleCloseModal}
      mainContainerStyle={{}}
      subContainerStyle={{}}
      overlayStyle={{}}
      animation="fade"
      transparent={true}>
      <View style={{ paddingVertical: heightPercentageToDP(1) }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}></View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',

          paddingVertical: heightPercentageToDP(2),
        }}>
        <Text
          style={[
            textStyles.regularSemiBold,
            {
              color: 'black',
              textAlign: 'center',
              paddingHorizontal: widthPercentageToDP(4),
            },
          ]}>
          {errorMessage}. Please try again. 😊
        </Text>
      </View>
      <View
        style={{
          paddingVertical: heightPercentageToDP(1),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CustomButton primary text={'Okay'} onPress={handleCloseModal} small />
      </View>
    </CustomModal>
  )
}
export { ErrorModal }
