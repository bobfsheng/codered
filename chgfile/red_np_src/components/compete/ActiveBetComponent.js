import React, { memo, useEffect, useState, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Timer } from 'react-native-stopwatch-timer'
import moment from 'moment'
import { Icon, ChallengeOptionsComponent } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useAuthSelector } from '@store'
import { useFriendOption } from '@hooks'

const ActiveBetComponent = memo(({ betInfo }) => {
  const {
    uid,
    friendName = '',
    //REPLACE THIS WITH THE BEARER TOKEN PULL
    friendEmoji,
    userCurrentEquity,
    friendCurrentEquity,
    acceptedAt,
    timeline,
    friendId,
    friendEquity,
    userEquity,
    uName,
    uEmoji,
  } = betInfo ?? {}
  const { userId, userEmoji } = useAuthSelector(state => state)
  const { showFriendOptionId, setShowFriendOptionId } = useFriendOption()

  function isValidNumber(num) {
    return typeof num === 'number' && !isNaN(num)
  }

  const opponentProfit = useMemo(() => {
    const friendProfit = friendCurrentEquity - friendEquity
    const userProfit = userCurrentEquity - userEquity
    return userId === uid
      ? isValidNumber(friendProfit)
        ? friendProfit
        : 0
      : isValidNumber(userProfit)
      ? userProfit
      : 0
  }, [])

  const userProfit = useMemo(() => {
    const friendProfit = friendCurrentEquity - friendEquity
    const userProfit = userCurrentEquity - userEquity
    return userId === uid
      ? isValidNumber(userProfit)
        ? userProfit
        : 0
      : isValidNumber(friendProfit)
      ? friendProfit
      : 0
  }, [])

  const opponentName = useMemo(() => {
    return userId === uid ? friendName : uName
  }, [])

  const opponentEmoji = useMemo(() => {
    return userId === uid ? friendEmoji : uEmoji
  }, [])

  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(2)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const [remainingTime, setRemainingTime] = useState(0)
  const [timerStart, setTimerStart] = useState(false)

  const calculateTimer = async () => {
    let endingTime = new Date(acceptedAt)
    endingTime.setHours(endingTime.getHours() + parseInt(timeline))
    const nowTime = new Date()
    if (endingTime > nowTime) {
      const timeDifference = endingTime.getTime() - nowTime.getTime()
      setRemainingTime(timeDifference)
      setTimeout(() => {
        setTimerStart(true)
      }, 1000)
    }
  }
  useEffect(() => {
    calculateTimer()
  }, [])

  // console.log('uid', uid)

  return (
    <>
      <View
        style={{
          borderColor: colors.primary,
          borderWidth: heightPercentageToDP(0.1),
          width: widthPercentageToDP(90),
          alignSelf: 'center',
          marginHorizontal: widthPercentageToDP(3),
          borderRadius: heightPercentageToDP(1),
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
            {timerStart ? (
              <Timer
                totalDuration={remainingTime}
                start={timerStart}
                options={{
                  text: [
                    textStyles.smallBold,
                    {
                      color: 'white',
                      fontSize: actuatedNormalize(15),
                    },
                  ],
                }}
                handleFinish={() => {}}
              />
            ) : (
              <Text
                style={[
                  textStyles.smallBold,
                  {
                    color: 'white',
                    fontSize: actuatedNormalize(15),
                  },
                ]}>
                --:--:--
              </Text>
            )}
            <Icon
              type="Entypo"
              name={'dots-three-horizontal'}
              size={heightPercentageToDP(2.4)}
              color="white"
              // onPress={() => setFollow(prev => !prev)}
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
                    You
                  </Text>
                  <Text
                    style={[
                      textStyles.smallSemiBold,
                      {
                        color: 'gray',
                        fontSize: actuatedNormalize(14),
                      },
                    ]}>
                    {' '}
                    {isNaN((userCurrentEquity - userEquity) / userEquity)
                      ? ''
                      : (((userCurrentEquity - userEquity) / userEquity) * 100)?.toFixed(
                          3,
                        )}
                    %
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: userProfit > opponentProfit ? '#9ECB8E' : '#6A835A',
                    width: widthPercentageToDP(
                      userProfit > opponentProfit
                        ? 60
                        : Math.sign((userProfit + 0.00001 * 60) / opponentProfit),
                    ),
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
                  ${formatValue(userProfit)}
                </Text>
              </View>
            </View>
          </View>
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
                        maxWidth: widthPercentageToDP(30),
                        color: 'gray',
                        fontSize: actuatedNormalize(14),
                      },
                    ]}>
                    {opponentName}
                  </Text>
                  <Text
                    style={[
                      textStyles.smallSemiBold,
                      {
                        color: 'gray',
                        fontSize: actuatedNormalize(14),
                      },
                    ]}>
                    {' '}
                    {isNaN((friendCurrentEquity - friendEquity) / friendEquity)
                      ? ''
                      : (
                          ((friendCurrentEquity - friendEquity) / friendEquity) *
                          100
                        ).toFixed(3)}{' '}
                    %
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: opponentProfit > userProfit ? '#9ECB8E' : '#6A835A',
                    width: widthPercentageToDP(
                      opponentProfit > userProfit
                        ? 60
                        : Math.sign((opponentProfit + 0.00001 * 60) / userProfit),
                    ),
                    height: heightPercentageToDP(2),
                    borderRadius: heightPercentageToDP(5),
                  }}></View>
                <Text
                  style={[
                    textStyles.smallBold,
                    {
                      color: opponentProfit < 0 ? colors.redError : colors.primary,
                      fontSize: actuatedNormalize(15),
                    },
                  ]}>
                  ${formatValue(opponentProfit)}
                </Text>
              </View>
            </View>
          </View>
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
          />
        </View>
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
  orderOption: {
    borderRadius: 30,
    paddingHorizontal: widthPercentageToDP(4),
    marginHorizontal: widthPercentageToDP(2),
    height: heightPercentageToDP(4.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export { ActiveBetComponent }
