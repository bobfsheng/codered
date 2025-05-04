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

const GameLeaderComponent = memo(({ score, userName, id, rank }) => {
  const { userInfo, followLoading, isFollowing, handleFollow } = useFriend({ id })
  const { showFriendOptionId, setShowFriendOptionId } = useFriendOption()
  const { isLoading, handleUnblock } = useBlock()
  const [showHistory, setShowHistory] = useState(false)
  const [showPositions, setShowPositions] = useState(false)
  const formatValue = value => {
    if (value === null || value === undefined) return '0'
    return value
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <>
      <View
        style={{
          paddingHorizontal: widthPercentageToDP(5),
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <View>
          <TouchableOpacity onPress={() => setShowPositions(prev => !prev)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={[
                  styles.userNameText,
                  {
                    marginTop: heightPercentageToDP(0.5),
                    marginRight: widthPercentageToDP(5),
                  },
                ]}>
                {`${rank}.`}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.userNameText, { width: widthPercentageToDP(55) }]}>
                <Icon
                  type="FontAwesome5"
                  name="user-alt"
                  size={widthPercentageToDP(4)}
                  style={{
                    marginTop: heightPercentageToDP(0.3),
                    marginRight: widthPercentageToDP(3),
                    width: widthPercentageToDP(8),
                  }}
                  color="white"
                />{' '}
                {userName}
                {'  '}
              </Text>
              <Text style={[styles.balanceText]}>{`${formatValue(
                parseFloat(score),
              )}  `}</Text>

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
                      type="Ionicons"
                      name={isFollowing == false ? 'add-circle' : 'checkmark-circle'}
                      size={actuatedNormalize(22)}
                      color="white"
                      onPress={() => handleFollow(id)}
                    />
                  )}
                  <Icon
                    type="Entypo"
                    name={'dots-three-vertical'}
                    size={heightPercentageToDP(2.5)}
                    color="white"
                    onPress={() => setShowFriendOptionId(id)}
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
        </View>
      </View>
      <HorizontalRule style={{ marginVertical: heightPercentageToDP(2) }} />
    </>
  )
})
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
      fontSize: actuatedNormalize(15),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  balanceText: [
    textStyles.bigBold,
    {
      color: colors.primary2,
      fontSize: actuatedNormalize(20),
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
export { GameLeaderComponent }
