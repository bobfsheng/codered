import React, { memo } from 'react'
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { Icon, OptionsComponent } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useBlock, useFriend, useFriendOption } from '@hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationService } from '@navigation'

const UserComponent = memo(({ data }) => {
  const { userInfo, followLoading, isFollowing, handleFollow, handleGetUserInfo } =
    useFriend(data)
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
      {userInfo.userName && (
        <View
          style={{
            borderColor: colors.primary,
            borderBottomWidth: heightPercentageToDP(0.05),
            alignSelf: 'center',
            width: '96%',
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
                {/* <TouchableOpacity onPress={()=> setUserModalVisible(true)}> */}
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
                        ? '😊'
                        : userInfo?.userEmoji}
                    </Text>
                  </View>

                  <View style={{ marginLeft: widthPercentageToDP(2) }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        textStyles.smallSemiBold,
                        {
                          maxWidth: widthPercentageToDP(30),
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
                  <Pressable
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
                      NavigationService.navigate('ProfileUser', {
                        userInfo: userInfo,
                        isFollowing: isFollowing,
                        handleFollow: handleFollow,
                        followLoading: followLoading,
                      })
                    }>
                    <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
                      Game
                    </Text>
                  </Pressable>
                  {followLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Icon
                      style={{ marginRight: widthPercentageToDP(3) }}
                      type="Ionicons"
                      name={isFollowing == false ? 'add-circle' : 'checkmark-circle'}
                      size={actuatedNormalize(25)}
                      color="white"
                      onPress={() => handleFollow(userInfo.uid)}
                    />
                  )}
                  <Icon
                    type="Entypo"
                    name={'dots-three-vertical'}
                    size={heightPercentageToDP(2.5)}
                    color="white"
                    onPress={() => setShowFriendOptionId(userInfo.uid)}
                    props={{ disabled: isLoading }}
                  />
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
          userInfo={userInfo}
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
export { UserComponent }