import React, { memo, useState } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { NavigationService } from '@navigation'
import { Icon } from '@components'
import { useAuthSelector } from '@store'
import { useBlock, useFriend, useFriendOption } from '@hooks'
import {
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  actuatedNormalize,
} from '@utils'
import moment from 'moment'

const FriendChatComponent = memo(
  ({ data, showFriendOptionId, setShowFriendOptionId }) => {
    const { userInfo, followLoading, isFollowing, handleFollow, handleGetUserInfo } =
      useFriend({ uid: data.otherUserId })
    const { isLoading, handleUnblock } = useBlock()
    const [userModalVisible, setUserModalVisible] = useState(false)

    return (
      <View
        style={{
          borderColor: colors.primary,
          paddingVertical: heightPercentageToDP(0.5),
          borderBottomWidth: heightPercentageToDP(0.1),
          alignSelf: 'center',
          width: '100%',
        }}>
        <View
          style={{
            padding: widthPercentageToDP(3),
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate('Chat', {
                  userInfo: userInfo,
                  roomId: data.id,
                })
              }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                    marginHorizontal: widthPercentageToDP(1),
                    backgroundColor: colors.offWhite,
                    width: widthPercentageToDP(13),
                    height: widthPercentageToDP(13),
                    borderRadius: widthPercentageToDP(30),
                  }}>
                  <Text
                    style={{
                      fontSize: actuatedNormalize(14),
                      color: 'white',
                      margin: widthPercentageToDP(0.5),
                      alignSelf: 'center',
                    }}>
                    {userInfo?.userEmoji ?? '🚀'}
                  </Text>
                </View>

                <View style={{ marginLeft: widthPercentageToDP(2) }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      textStyles.smallSemiBold,
                      {
                        width: widthPercentageToDP(30),
                        color: 'white',
                        fontSize: actuatedNormalize(14),
                      },
                    ]}>
                    {userInfo?.userName}
                  </Text>
                  <Text
                    style={[
                      textStyles.smallRegular,
                      {
                        color: 'gray',
                        fontSize: actuatedNormalize(15),
                      },
                    ]}>
                    {data?.lastMessage?.message?.length > 20
                      ? `${data?.lastMessage?.message.slice(0, 20)}...`
                      : `${data?.lastMessage?.message ?? ''}`}
                    <Text
                      style={[
                        textStyles.smallRegular,
                        {
                          color: 'gray',
                          fontSize: actuatedNormalize(11),
                        },
                      ]}>
                      {`  ${moment(data.updatedAt).format('LT')}`}
                    </Text>
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
                {/* <Icon
                type="Entypo"
                name={'dots-three-vertical'}
                size={heightPercentageToDP(2.5)}
                color="white"
                onPress={() => setShowFriendOptionId(userInfo.uid)}
                props={{ disabled: isLoading }}
              /> */}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  },
)

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

export { FriendChatComponent }
