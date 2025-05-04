import React, { memo } from 'react'
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { OptionsComponent } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useBlock, useFriendOption } from '@hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationService } from '@navigation'

const BetUserComponent = memo(({ userInfo, handleSelectUser, handleNavigateToChat }) => {
  const { showFriendOptionId, setShowFriendOptionId } = useFriendOption()
  const { isLoading, handleUnblock } = useBlock()
  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(0)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <>
      {userInfo?.userName && (
        <View
          style={{
            borderColor: colors.primary,
            borderWidth: heightPercentageToDP(0.3),
            alignSelf: 'center',
            width: '90%',
            marginVertical: heightPercentageToDP(1),
            borderRadius: heightPercentageToDP(1),
          }}>
          <View
            style={{
              padding: widthPercentageToDP(3),
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => NavigationService.navigate('ProfileUser', { userInfo })}>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      marginHorizontal: widthPercentageToDP(1),
                      backgroundColor: colors.offWhite,
                      width: widthPercentageToDP(11),
                      height: widthPercentageToDP(11),
                      borderRadius: widthPercentageToDP(30),
                    }}>
                    <Text
                      style={{
                        fontSize: actuatedNormalize(14),
                        color: 'white',
                        margin: widthPercentageToDP(0.5),
                        alignSelf: 'center',
                      }}>
                      {userInfo?.userEmoji == '' || userInfo?.userEmoji == undefined
                        ? '🚀'
                        : userInfo?.userEmoji}
                    </Text>
                  </View>

                  <View style={{ marginLeft: widthPercentageToDP(2) }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        textStyles.smallSemiBold,
                        {
                          width: widthPercentageToDP(30),
                          color: 'gray',
                          fontSize: actuatedNormalize(14),
                        },
                      ]}>
                      {userInfo?.userName}
                    </Text>
                    <Text
                      style={[
                        textStyles.smallBold,
                        {
                          color: colors.primary,
                          fontSize: actuatedNormalize(15),
                        },
                      ]}>
                      {`$${formatValue(userInfo?.portfolioYalue) || '0'}`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {userInfo?.isBlocked ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Pressable
                      style={[
                        styles.orderOption,
                        {
                          borderColor: 'black',
                          borderWidth: heightPercentageToDP(0.1),
                          backgroundColor: 'white',
                        },
                      ]}
                      onPress={() => {
                        handleUnblock(data.uid)
                        handleGetUserInfo()
                      }}>
                      <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
                        Unblock
                      </Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[
                      styles.orderOption,
                      {
                        borderColor: 'black',
                        borderWidth: heightPercentageToDP(0.1),
                        backgroundColor: 'white',
                      },
                    ]}
                    disabled={isLoading}
                    onPress={() =>
                      handleSelectUser == false
                        ? handleNavigateToChat(userInfo)
                        : handleSelectUser(userInfo)
                    }>
                    <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
                      {handleSelectUser == false ? 'Chat' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
      {!!showFriendOptionId && (
        <OptionsComponent
          chat={false}
          challengeType={'friend'}
          visible={!!showFriendOptionId}
          handleClose={() => setShowFriendOptionId('')}
          userId={showFriendOptionId}
        />
      )}
    </>
  )
})
const styles = StyleSheet.create({
  orderCardIcon: {
    resizeMode: 'contain',
    height: heightPercentageToDP(11),
    width: widthPercentageToDP(11),
  },

  orderOption: {
    borderRadius: 30,
    paddingHorizontal: widthPercentageToDP(4),
    marginHorizontal: widthPercentageToDP(2),
    height: heightPercentageToDP(4.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export { BetUserComponent }
