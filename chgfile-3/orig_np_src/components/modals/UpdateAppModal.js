import React from 'react'
import { View, Text, Image } from 'react-native'
import { colors, heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { Icon } from '@components'
import { CustomModal } from '@components'
import { useUserSelector } from '@store'
const money = require('@assets/images/HomeScreen/profit.jpeg')

const UpdateAppModal = ({ visible, handleCloseModal }) => {
  const { dailyProfile } = useUserSelector(state => state)
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
          alignItems: 'center',
          paddingHorizontal: widthPercentageToDP(5),
        }}>
        <Text
          style={[
            textStyles.bigBold,
            { color: 'black' },
          ]}>{`New update available!`}</Text>
        <Text
          style={[
            textStyles.regularSemiBold,
            {
              color: 'black',
              marginVertical: heightPercentageToDP(2),
            },
          ]}>
          {`Please download the updated app from the store`}
        </Text>
        <Image
          source={money}
          style={{
            height: widthPercentageToDP(30),
            width: widthPercentageToDP(30),
            resizeMode: 'contain',
            marginBottom: heightPercentageToDP(2),
          }}
        />
      </View>
    </CustomModal>
  )
}
export { UpdateAppModal }
