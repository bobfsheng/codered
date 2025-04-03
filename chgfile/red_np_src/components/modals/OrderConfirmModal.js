import React from 'react'
import { Pressable, Image } from 'react-native'
import { useAuthSelector } from '@store'
import { heightPercentageToDP, widthPercentageToDP } from '@utils'
import { CustomModal } from '@components'
import { NavigationService } from '@navigation'
const lockedmodal1 = require('../../assets/images/HomeScreen/100k.png')
// const confirmModal = require('../../assets/images/onboarding/invested.gif')
const OrderConfirmModal = ({ visible, handleCloseModal }) => {
  const { isLoggedIn } = useAuthSelector(state => state)
  const handleOnlyClose = () => {
    handleCloseModal()
  }
  const handleCloseAndNavigate = () => {
    handleCloseModal()
    NavigationService.navigate('Account', { screen: 'SignUpScreen' })
  }

  return (
    <CustomModal
      visible={visible}
      handleCloseModal={isLoggedIn ? handleOnlyClose : handleCloseAndNavigate}
      mainContainerStyle={{ justifyContent: 'flex-start' }}
      subContainerStyle={{
        backgroundColor: 'transparent',
        borderWidth: 0,
        width: '100%',
      }}
      overlayStyle={{}}
      animation="slide"
      transparent={true}>
      {/* PAIN HERE */}
      <Pressable onPress={isLoggedIn ? handleCloseModal : handleCloseAndNavigate}>
        <Image
          source={isLoggedIn ? confirmModal : lockedmodal1}
          style={{
            width: widthPercentageToDP('100'),
            height: heightPercentageToDP(isLoggedIn ? '80' : '42'),
            resizeMode: 'contain',
            marginTop: heightPercentageToDP(isLoggedIn ? '0' : '20'),
          }}
        />
      </Pressable>
    </CustomModal>
  )
}
export { OrderConfirmModal }
