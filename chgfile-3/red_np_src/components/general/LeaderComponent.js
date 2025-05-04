import React, { memo, useState, useEffect } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import database from '@react-native-firebase/database'
import LinearGradient from 'react-native-linear-gradient'
import {
  actuatedNormalize,
  capitalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { Icon, HorizontalRule, OptionsComponent } from '@components'
import { useBlock, useFriend, useFriendOption } from '@hooks'
const sell = require('@assets/images/orders/sell.png')
const buy = require('@assets/images/orders/buy.png')

const LeaderComponent = memo(
  ({ positions, activities, portfolioValue, weeklyRank, uid }) => {
    const { userInfo, followLoading, isFollowing, handleFollow } = useFriend({ uid })
    const { showFriendOptionId, setShowFriendOptionId } = useFriendOption()
    const { isLoading, handleUnblock } = useBlock()
    const [showHistory, setShowHistory] = useState(false)
    const [showPositions, setShowPositions] = useState(false)
    const formatValue = value => {
      if (!value) return
      return value
        ?.toFixed(0)
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    async function getUserName(uid) {
      try {
        const userRef = database().ref(`/User/${uid}`)
        const snapshot = await userRef.once('value')
        const userName = snapshot.val()?.userName
        return userName
      } catch (error) {
        console.error(`Error retrieving user data: ${error.message}`)
        return null
      }
    }
    const [userName, setUserName] = useState('Anonymous')
    useEffect(() => {
      getUserName(uid).then(userName => {
        if (userName) {
          setUserName(capitalize(userName))
        } else {
          setUserName('Anonymous')
        }
      })
    }, [])

    // console.log(activities)

    return (
      <>
        <View style={{ paddingHorizontal: widthPercentageToDP(5), flexDirection: 'row' }}>
          <View>
            <TouchableOpacity onPress={() => setShowPositions(prev => !prev)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={[
                    styles.userNameText,
                    {
                      marginTop: heightPercentageToDP(1),
                      marginRight: widthPercentageToDP(5),
                    },
                  ]}>
                  {`${weeklyRank}.`}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.userNameText, { width: widthPercentageToDP(35) }]}>
                  <Icon
                    type="FontAwesome5"
                    name="user-alt"
                    size={widthPercentageToDP(4)}
                    style={{
                      marginTop: heightPercentageToDP(0.3),
                      marginRight: widthPercentageToDP(3),
                    }}
                    color="white"
                  />{' '}
                  {/* {userName !== null && userName !== undefined ? userName : 'Anonymous'} */}
                  {userName}
                  {'  '}
                  {/* {' '}Username{'        '} */}
                </Text>
                <Text style={[styles.balanceText]}>{`$${formatValue(
                  parseFloat(portfolioValue),
                )}`}</Text>

                {userInfo?.isBlocked ? null : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: heightPercentageToDP(2),
                    }}>
                    {followLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <Icon
                        // style={{marginLeft:widthPercentageToDP(3)}}
                        type="Ionicons"
                        name={isFollowing == false ? 'add-circle' : 'checkmark-circle'}
                        size={actuatedNormalize(22)}
                        color="white"
                        onPress={() => handleFollow(uid)}
                      />
                    )}
                    <Icon
                      type="Entypo"
                      name={'dots-three-vertical'}
                      size={heightPercentageToDP(2.5)}
                      color="white"
                      onPress={() => setShowFriendOptionId(uid)}
                      props={{ disabled: isLoading }}
                    />
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
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* Show stocks here  */}
              <View style={{ flexDirection: 'row', width: widthPercentageToDP(65) }}>
                {positions?.slice(0, 2).map((asset, index) => (
                  <TouchableOpacity
                    onPress={() => setShowPositions(prev => !prev)}
                    key={index}>
                    <View style={[styles.tickerContainer]}>
                      <Text style={[styles.tickerText]}>{asset?.symbol}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setShowPositions(prev => !prev)}>
                  <Text
                    style={[
                      styles.tickerText,
                      {
                        marginLeft: widthPercentageToDP(1),
                        fontSize: actuatedNormalize(11),
                      },
                    ]}>
                    +{positions?.length} more
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setShowHistory(prev => !prev)}>
                <Text
                  style={[
                    styles.tickerText,
                    {
                      color: 'gray',
                      marginTop: heightPercentageToDP(3),
                      justifyContent: 'flex-end',
                      alignContent: 'flex-end',
                      alignSelf: 'flex-end',
                      alignItems: 'flex-end',
                    },
                  ]}>
                  {showHistory == false ? 'show activity' : 'hide activity'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <HorizontalRule style={{ marginVertical: heightPercentageToDP(2) }} />

        {showHistory && (
          <ScrollView style={{ height: heightPercentageToDP(17) }}>
            {activities
              ?.filter(activity => activity?.side)
              .map((activity, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    NavigationService.navigate('Invest', {
                      screen: 'InvestTab',
                      params: {
                        stockTicker: activity?.symbol,
                      },
                    })
                  }>
                  <View style={styles.positionCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <Image
                        source={activity.side === 'buy' ? buy : sell}
                        style={styles.orderCardIcon}
                      />
                      <View
                        style={{
                          flexDirection: 'column',
                          marginLeft: widthPercentageToDP(5),
                        }}>
                        <Text
                          style={[
                            textStyles.normalBold,
                            {
                              color:
                                activity?.order_status === 'filled'
                                  ? '#78C62A'
                                  : '#4AC6D7',
                              fontSize: actuatedNormalize(14),
                              marginLeft: widthPercentageToDP(0),
                              width: widthPercentageToDP(67),
                            },
                          ]}>
                          {capitalize(activity?.side)} {activity?.symbol}
                        </Text>
                        <Text
                          style={[
                            textStyles.normalSemiBold,
                            {
                              color: 'white',
                              fontSize: actuatedNormalize(12),
                              marginTop: heightPercentageToDP(1),
                              marginRight: widthPercentageToDP(0),
                            },
                          ]}>
                          Quantity: {activity?.qty}{' '}
                        </Text>
                        <Text
                          style={[
                            textStyles.normalSemiBold,
                            {
                              color: 'white',
                              fontSize: actuatedNormalize(12),
                              marginRight: widthPercentageToDP(0),
                            },
                          ]}>
                          Price: $ {formatValue(parseFloat(activity?.price))}
                        </Text>
                        <Text
                          style={[
                            textStyles.normalSemiBold,
                            {
                              color: 'white',
                              fontSize: actuatedNormalize(12),
                              marginRight: widthPercentageToDP(0),
                            },
                          ]}>
                          {capitalize(activity?.order_status)?.replace('_', ' ')} at{' '}
                          {new Date(activity?.transaction_time)?.getMonth() + 1}/
                          {new Date(activity?.transaction_time)?.getDate()}/
                          {new Date(activity?.transaction_time)?.getFullYear()}{' '}
                          {new Date(activity?.transaction_time)?.getHours()}:
                          {new Date(activity?.transaction_time)?.getMinutes().toString()
                            .length < 2
                            ? `0` + new Date(activity?.transaction_time)?.getMinutes()
                            : new Date(activity?.transaction_time)?.getMinutes()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}

        {showPositions && (
          <ScrollView style={{ height: heightPercentageToDP(17) }}>
            {positions?.map((position, index) => (
              <LinearGradient
                key={index}
                colors={['#1F1C1B', '#1F1C1B']}
                style={[styles.positionCard, { width: widthPercentageToDP(90) }]}>
                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: widthPercentageToDP(5),
                  }}>
                  <Text
                    style={[
                      textStyles.normalSemiBold,
                      {
                        color: 'white',
                        fontSize: actuatedNormalize(17),
                      },
                    ]}>
                    {position?.symbol}
                  </Text>
                  <Text
                    style={[
                      textStyles.normalRegular,
                      {
                        color: 'white',
                        fontSize: actuatedNormalize(12),

                        marginTop: heightPercentageToDP(1),
                      },
                    ]}>
                    Qty{' '}
                    {isNaN(position?.qty) || position?.qty == null
                      ? '$ ' + parseFloat(position?.notional)?.toFixed(1)
                      : parseFloat(position?.qty)?.toFixed(1)}
                  </Text>
                  <Text
                    style={[
                      textStyles.normalBold,
                      {
                        color: position?.unrealized_pl < 0 ? '#EB5757' : '#78C62A',
                        fontSize: actuatedNormalize(13),
                      },
                    ]}>
                    {`P&L $${parseFloat(position?.unrealized_pl)?.toFixed(2)}`}
                  </Text>
                  <Text
                    style={[
                      textStyles.normalRegular,
                      {
                        color: 'white',
                        fontSize: actuatedNormalize(12),
                      },
                    ]}>
                    {position?.side === 'long' ? 'Bought' : 'Short'} {'at $ '}
                    {formatValue(parseFloat(position?.avg_entry_price))}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    marginRight: widthPercentageToDP(5),
                    alignItems: 'space-around',
                  }}>
                  <View
                    style={{
                      marginTop: heightPercentageToDP(2),
                      borderRadius: widthPercentageToDP(2),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      height: heightPercentageToDP(4),
                      width: widthPercentageToDP(20),
                    }}>
                    <Pressable
                      onPress={() =>
                        NavigationService.navigate('Invest', {
                          screen: 'InvestScreenPosition',
                          params: {
                            stockTicker: position?.symbol,
                            amount:
                              position?.side === 'long'
                                ? position?.qty
                                : Math.abs(position?.qty),
                            price: position?.avg_entry_price,
                            side: position?.side === 'long' ? 'short' : 'long',
                            pl: position?.unrealized_pl,
                          },
                        })
                      }>
                      <Text
                        style={[
                          textStyles.smallSemiBold,
                          {
                            color: 'black',
                            fontSize: actuatedNormalize(15),
                          },
                        ]}>
                        Buy
                      </Text>
                    </Pressable>
                  </View>
                  <Text
                    style={[
                      textStyles.normalSemiBold,
                      {
                        color: 'white',
                        fontSize: actuatedNormalize(12),
                        marginTop: heightPercentageToDP(2),
                        marginLeft: widthPercentageToDP(5),
                      },
                    ]}>
                    Total ${' '}
                    {Math.abs((position?.qty * position?.avg_entry_price)?.toFixed(0))}
                  </Text>
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        )}
      </>
    )
  },
)
const styles = StyleSheet.create({
  tickerContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: widthPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    borderRadius: widthPercentageToDP(2),
    borderWidth: widthPercentageToDP(0.3),
  },
  userNameText: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(13),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  balanceText: [
    textStyles.bigBold,
    {
      color: colors.primary2,
      fontSize: actuatedNormalize(18),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  tickerText: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(12),
    },
  ],
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    height: heightPercentageToDP(15),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.15),

    borderColor: 'black',
    backgroundColor: '#1F1C1B',
    marginBottom: heightPercentageToDP(2),
  },

  orderCardIcon: {
    resizeMode: 'contain',
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(13),
    marginLeft: widthPercentageToDP(4),
  },
})
export { LeaderComponent }
