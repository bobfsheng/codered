import React, { memo } from 'react'
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  colors,
} from '@utils'
import { CustomButton } from '@components'
import { BottomSheetModal } from './BottomSheetModal'
import { Icon } from '../general'
import { NavigationService } from '@navigation'
const ChallengeSentBottomSheet = memo(
  ({ isVisible, handleCloseModal, friendName, timeline, challengeType }) => {
    const time = timeline === '1' ? '1 hour' : timeline === '24' ? '24 hours' : 'Week'
    return (
      <BottomSheetModal isVisible={isVisible} handleCloseModal={handleCloseModal}>
        <View
          style={{
            backgroundColor: 'black',
            borderRadius: actuatedNormalize(8),
            width: widthPercentageToDP(100),
            height: heightPercentageToDP(20),
          }}>
          <Icon
            type="Ionicons"
            name={'close'}
            size={widthPercentageToDP(5)}
            color="white"
            onPress={handleCloseModal}
            style={{
              alignSelf: 'flex-end',
              marginTop: heightPercentageToDP(10),
              marginRight: widthPercentageToDP(4),
            }}
          />
        </View>
        <View style={{ padding: widthPercentageToDP(6) }}>
          <Text
            style={[
              textStyles.bigRegular,
              {
                fontSize: actuatedNormalize(40),
                color: 'white',
                textAlign: 'center',
                marginBottom: heightPercentageToDP(2),
              },
            ]}>
            🏆
          </Text>
          <Text
            style={[
              textStyles.bigRegular,
              {
                fontSize: actuatedNormalize(16),
                color: 'white',
                textAlign: 'center',
                marginBottom: heightPercentageToDP(2),
              },
            ]}>
            {`1. Your challenge was sent to ${friendName}`}
          </Text>
          <Text
            style={[
              textStyles.bigRegular,
              {
                fontSize: actuatedNormalize(16),
                color: 'white',
                textAlign: 'center',
                marginBottom: heightPercentageToDP(2),
              },
            ]}>
            2. When they accept, you will get a notification & the challenge will start
          </Text>
          <Text
            style={[
              textStyles.bigRegular,
              {
                fontSize: actuatedNormalize(16),
                color: 'white',
                textAlign: 'center',
              },
            ]}>
            {`3. Trader with the ${
              challengeType == '$' ? 'highest profit amount' : 'highest profit percentage'
            } will win in ${time}`}
          </Text>
          <CustomButton
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
              marginTop: heightPercentageToDP(3),
            }}
            primary
            text="Start Investing"
            onPress={() => {
              handleCloseModal() // Invoke handleCloseModal function
              NavigationService.navigate('Invest', {
                screen: 'InvestTab',
              })
            }}
          />
        </View>
      </BottomSheetModal>
    )
  },
)

const styles = StyleSheet.create({
  topSection: {
    height: heightPercentageToDP('55'),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.darkBackground,
    minHeight: Math.round(Dimensions.get('window').height / 2),
    paddingHorizontal: widthPercentageToDP(5),
    marginTop: heightPercentageToDP(2),
  },
  imageBelow: {
    resizeMode: 'contain',
    marginTop: heightPercentageToDP('10'),
    width: widthPercentageToDP('80'),
    height: heightPercentageToDP('60'),
    alignSelf: 'center',
  },
})

export { ChallengeSentBottomSheet }
