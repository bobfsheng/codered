import React, { memo, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon, ChallengeOptionsComponent } from '@components'
import { NavigationService } from '@navigation'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useAuthSelector } from '@store'
import { useFriend, useFriendOption } from '@hooks'

const PastBetComponent = memo(({ betInfo }) => {
  const {
    winnerId,
    friendName,
    friendEmoji,
    friendFinalEquity,
    friendEquity,
    friendId,
    updatedAt,
    userFinalEquity,
    userEquity,
    betAmount,
    uEmoji,
    uName,
    uid,
    // bettingId,
  } = betInfo ?? {}
  // console.log({bettingId, friendName, uName})
  const { userId } = useAuthSelector(state => state)
  const { showFriendOptionId, setShowFriendOptionId } = useFriendOption()
  const data = useMemo(() => {
    return {
      uid: userId === uid ? friendId : uid,
    }
  }, [])

  const opponentProfit = useMemo(() => {
    return userId === uid
      ? friendFinalEquity - friendEquity
      : userFinalEquity - userEquity
  }, [])

  const opponentEmoji = useMemo(() => {
    return userId === uid ? friendEmoji : uEmoji
  }, [])

  const userEmoji = useMemo(() => {
    return userId === uid ? uEmoji : friendEmoji
  }, [])

  const userProfit = useMemo(() => {
    return userId === uid
      ? userFinalEquity - userEquity
      : friendFinalEquity - friendEquity
  }, [])

  const opponentName = useMemo(() => {
    return userId === uid ? friendName : uName
  }, [])

  const userEquityN = useMemo(() => {
    return userId === uid ? userEquity : friendEquity
  }, [])

  const friendEquityN = useMemo(() => {
    return userId === uid ? friendEquity : userEquity
  }, [])

  const opponentProfitPercent = useMemo(() => {
    const opponentEquity = userId === uid ? friendEquityN : userEquityN
    if (opponentEquity === 0) return 0 // Prevent division by zero
    return ((opponentProfit / opponentEquity) * 100).toFixed(3)
  }, [opponentProfit, friendEquityN, userEquityN, userId, uid])

  const userProfitPercent = useMemo(() => {
    const userEquity = userId === uid ? userEquityN : friendEquityN
    if (userEquity === 0) return 0 // Prevent division by zero
    return ((userProfit / userEquity) * 100).toFixed(3)
  }, [userProfit, userEquityN, friendEquityN, userId, uid])

  let userProfitAdjusted = userProfit
  let opponentProfitAdjusted = opponentProfit

  let minProfit = Math.min(userProfitAdjusted, opponentProfitAdjusted)

  if (minProfit < 0) {
    userProfitAdjusted += Math.abs(minProfit)
    opponentProfitAdjusted += Math.abs(minProfit)
  }

  let totalProfit = userProfitAdjusted + opponentProfitAdjusted
  totalProfit = totalProfit === 0 ? 0.0001 : totalProfit

  let userRatio = userProfitAdjusted / totalProfit
  let opponentRatio = opponentProfitAdjusted / totalProfit

  let userWidth = 0
  let opponentWidth = 0

  // If total profit is zero (meaning both profits were zero), set widths to default value
  if (totalProfit === 0.0001) {
    userWidth = widthPercentageToDP(30)
    opponentWidth = widthPercentageToDP(30)
  } else {
    // Otherwise, scale the widths based on the profit ratios
    userWidth = widthPercentageToDP(Math.max(5, Math.min(60, userRatio * 60)))
    opponentWidth = widthPercentageToDP(Math.max(5, Math.min(60, opponentRatio * 60)))
  }

  const date = new Date(updatedAt)

  // Extracting the date components
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  // Extracting the time components
  let hours = date.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours %= 12
  hours = hours || 12
  const minutes = date.getMinutes().toString().padStart(2, '0')

  // Combining the date and time components
  const convertedDateTime = `${month}-${day}-${year}`
  const convertedHour = `${hours}:${minutes}${ampm}`

  const { userInfo } = useFriend(data)

  return (
    <View
      style={{
        borderColor: colors.primary,
        borderWidth: heightPercentageToDP(0.1),
        width: widthPercentageToDP(90),
        alignSelf: 'center',
        borderRadius: heightPercentageToDP(1),
        marginHorizontal: widthPercentageToDP(3),
      }}>
      <View
        style={{
          padding: widthPercentageToDP(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: heightPercentageToDP(2),
          }}>
          <Text
            style={[
              textStyles.smallBold,
              {
                color: userProfit > opponentProfit ? colors.primary : colors.offWhite,
                fontSize: actuatedNormalize(15),
              },
            ]}>
            {userProfit > opponentProfit
              ? `$${betAmount * 2 * 0.9} +`
              : winnerId == ''
              ? `$ ${betAmount}`
              : `- $${betAmount} `}
          </Text>
          <Icon
            type="Entypo"
            name={'dots-three-horizontal'}
            size={heightPercentageToDP(2.4)}
            color="white"
            onPress={() => setShowFriendOptionId(friendId)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                marginHorizontal: widthPercentageToDP(1),
                backgroundColor: colors.offWhite,
                width: widthPercentageToDP(10),
                height: widthPercentageToDP(10),
                borderRadius: widthPercentageToDP(30),
              }}>
              <Text
                style={{
                  fontSize: actuatedNormalize(14),
                  color: 'white',
                  margin: widthPercentageToDP(0.5),
                  alignSelf: 'center',
                }}>
                {userEmoji !== undefined ? userEmoji : '🚀'}
              </Text>
            </View>
            <View style={{ marginLeft: widthPercentageToDP(2) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={[
                    textStyles.smallSemiBold,
                    {
                      color: 'gray',
                      fontSize: actuatedNormalize(14),
                    },
                  ]}>
                  You {userProfit > opponentProfit ? '🏆' : ''}
                </Text>
                <Text
                  style={[
                    textStyles.smallSemiBold,
                    {
                      color: 'gray',
                      fontSize: actuatedNormalize(14),
                    },
                  ]}>
                  {userProfitPercent} %
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: userProfit > opponentProfit ? '#9ECB8E' : '#3F4B36',
                  width: userWidth,
                  height: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(5),
                }}></View>
              <Text
                style={[
                  textStyles.smallBold,
                  {
                    color: userProfit < 0 ? colors.redError : colors.primary,
                    fontSize: actuatedNormalize(15),
                  },
                ]}>
                $ {userProfit?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => NavigationService.navigate('ProfileUser', { userInfo })}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: heightPercentageToDP(1),
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  marginHorizontal: widthPercentageToDP(1),
                  backgroundColor: colors.offWhite,
                  width: widthPercentageToDP(10),
                  height: widthPercentageToDP(10),
                  borderRadius: widthPercentageToDP(30),
                }}>
                <Text
                  style={{
                    fontSize: actuatedNormalize(14),
                    color: 'white',
                    margin: widthPercentageToDP(0.5),
                    alignSelf: 'center',
                  }}>
                  {opponentEmoji !== undefined ? opponentEmoji : '🚀'}
                </Text>
              </View>
              <View style={{ marginLeft: widthPercentageToDP(2) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      textStyles.smallSemiBold,
                      {
                        width: widthPercentageToDP(42),
                        color: 'gray',
                        maxWidth: widthPercentageToDP(30),
                        fontSize: actuatedNormalize(14),
                      },
                    ]}>
                    {opponentName} {opponentProfit > userProfit ? '🏆' : ''}
                  </Text>
                  <Text
                    style={[
                      textStyles.smallSemiBold,
                      {
                        color: 'gray',
                        fontSize: actuatedNormalize(14),
                      },
                    ]}>
                    {opponentProfitPercent} %
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: userProfit < opponentProfit ? '#9ECB8E' : '#3F4B36',
                    width: opponentWidth,
                    height: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(5),
                  }}></View>
                <Text
                  style={[
                    textStyles.smallBold,
                    {
                      color: opponentProfit > 0 ? colors.primary : colors.redError,
                      fontSize: actuatedNormalize(15),
                    },
                  ]}>
                  $ {opponentProfit?.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Text
            style={[
              textStyles.smallBold,
              {
                color: '#4B4B4B',
                fontSize: actuatedNormalize(12),
              },
            ]}>
            {convertedDateTime} {convertedHour}
          </Text>
        </View>
      </View>
      {!!showFriendOptionId && (
        <View style={styles.overlayContainer}>
          <ChallengeOptionsComponent
            chat={false}
            challengeType={'active'}
            visible={!!showFriendOptionId}
            handleClose={() => setShowFriendOptionId('')}
            userId={showFriendOptionId}
            friendId={friendId}
          />
        </View>
      )}
    </View>
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
  overlayContainer: {
    position: 'absolute',
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
    // top:heightPercentageToDP(10),
    paddingLeft: widthPercentageToDP(55),
    right: 0,
    bottom: 0,
    paddingBottom: heightPercentageToDP(4),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
})
export { PastBetComponent }
