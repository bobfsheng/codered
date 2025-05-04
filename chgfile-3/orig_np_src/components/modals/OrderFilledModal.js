import React from 'react'
import { View, Text } from 'react-native'
import {  heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { Icon } from '@components'
import { CustomModal } from '@components'
import { useUserSelector } from '@store'
const cash = require('@assets/images/cash.png')

const OrderFilledModal = ({ visible, handleCloseModal }) => {
  const { orderFilled } = useUserSelector(state => state)
  const { side, qty, status, symbol } = orderFilled
  return (
    <CustomModal
      visible={visible}
      handleCloseModal={handleCloseModal}
      mainContainerStyle={{}}
      subContainerStyle={{ backgroundColor: '#f7f7f7' }}
      overlayStyle={{}}
      animation="fade"
      transparent={true}>
      <View style={{ alignSelf: 'flex-end' }}>
        <Icon
          type="AntDesign"
          name="close"
          size={widthPercentageToDP(4)}
          color="black"
          onPress={handleCloseModal}
          style={{
            padding: heightPercentageToDP(1),
          }}
        />
      </View>
      <View
        style={{
          justifyContent: 'flex-start',
          paddingHorizontal: widthPercentageToDP(5),
        }}>
        <Text style={[textStyles.normalBold, { color: 'black' }]}>
          {`Your  ${symbol} order has been ${status}`}
        </Text>
        <Text
          style={[
            textStyles.regularSemiBold,
            {
              color: 'black',
              marginTop: heightPercentageToDP(1),
              marginBottom: heightPercentageToDP(2),
            },
          ]}>
          {`Your ${side} order of ${qty} stocks of ${symbol} has been ${status} `}
        </Text>
      </View>
    </CustomModal>
  )
}
export { OrderFilledModal }
