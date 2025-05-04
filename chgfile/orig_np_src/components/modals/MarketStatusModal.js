import { useUserSelector } from '@store'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import React, {memo} from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { CustomModal } from '@components'
const open = require('@assets/images/HomeScreen/open.png')
const closed = require('@assets/images/HomeScreen/closed.png')

const MarketStatusModal = memo(({ visible, handleCloseModal }) => {
  const { marketNextClose, marketNextOpen, marketStatus } = useUserSelector(
    state => state,
  )

  return (
    <CustomModal
      visible={visible}
      handleCloseModal={handleCloseModal}
      mainContainerStyle={{ justifyContent: 'flex-start' }}
      subContainerStyle={{
        backgroundColor: 'transparent',
        borderWidth: 0,
        width: '100%',
      }}
      overlayStyle={{}}
      animation="slide"
      transparent={true}>
      <View>
        <View>
          <Pressable onPress={handleCloseModal}>
            <Image
              source={marketStatus === true ? open : closed}
              style={{
                marginTop: heightPercentageToDP('0'),
                width: widthPercentageToDP('100'),
                height: heightPercentageToDP('35'),
                resizeMode: 'contain',
              }}
            />
          </Pressable>
          {marketStatus !== null && (
            <LinearGradient
              colors={['#EEEEEE', '#B2D0CE']}
              style={{
                width: widthPercentageToDP('95'),
                marginTop: heightPercentageToDP('-10'),
                height: heightPercentageToDP('8'),
                borderRadius: widthPercentageToDP(2),
                marginLeft: heightPercentageToDP('1'),
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={[
                  textStyles.smallRegular,
                  { fontSize: actuatedNormalize(12), color: 'black' },
                ]}>
                {
                  <>
                    {marketStatus === true ? (
                      <>
                        {isNaN(new Date(marketNextClose).getMonth() + 1)
                          ? ' '
                          : `Market Closes next on ${
                              new Date(marketNextClose).getMonth() + 1
                            }/${new Date(marketNextClose).getDate()}/${new Date(
                              marketNextClose,
                            ).getFullYear()} at ${new Date(
                              marketNextClose,
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`}
                      </>
                    ) : (
                      <>
                        Market Opens next on {new Date(marketNextOpen).getMonth() + 1}/
                        {new Date(marketNextOpen).getDate()}/
                        {new Date(marketNextOpen).getFullYear()} at{' '}
                        {new Date(marketNextOpen).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </>
                    )}
                  </>
                }
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </CustomModal>
  )
})

export { MarketStatusModal }
