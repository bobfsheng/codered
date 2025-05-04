import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon, ChallengeOptionsComponent } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  capitalize,
} from '@utils'
import { useAuthSelector } from '@store'
import { useFriendOption } from '@hooks'

const PendingBetComponent = memo(({ betInfo, getAllPendingUserBets }) => {
  const {
    uid,
    friendName = '',
    //REPLACE THIS WITH THE BEARER TOKEN PULL
    friendEmoji,
    acceptedAt,
    timeline,
    friendId,
    challengeType,
    betAmount,
    betId,
  } = betInfo ?? {}
  const { userEmoji } = useAuthSelector(state => state)
  const { showFriendOptionId, setShowFriendOptionId } = useFriendOption()

  const opponentName = friendName

  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(2)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
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
            paddingBottom: widthPercentageToDP(7),
            paddingTop: widthPercentageToDP(2),
            paddingHorizontal: widthPercentageToDP(4),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: heightPercentageToDP(5),
            }}>
            <Text
              style={[
                textStyles.smallSemiBold,
                {
                  color: 'gray',

                  fontSize: actuatedNormalize(14),
                },
              ]}>
              Pending...
            </Text>
            <Icon
              type="Entypo"
              name={'dots-three-horizontal'}
              size={heightPercentageToDP(2.4)}
              color="white"
              // onPress={() => setFollow(prev => !prev)}
              onPress={() => setShowFriendOptionId(friendId)}
            />
          </View>

          {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                numberOfLines={1}
                style={[
                  textStyles.smallSemiBold,
                  {
                    color: 'gray',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: actuatedNormalize(16),
                    maxWidth: widthPercentageToDP(50),
                  },
                ]}>
                {'  '}You vs {capitalize(opponentName)}
                {'  '}
              </Text>
              <View
                style={{
                  alignContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
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
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {friendEmoji !== undefined ? friendEmoji : '☺️'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text
          style={[
            textStyles.smallSemiBold,
            {
              color: colors.primary,
              alignContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: actuatedNormalize(14),
              paddingBottom: heightPercentageToDP(3),
            },
          ]}>
          {challengeType == '$'
            ? 'Highest Profit Amount Wins'
            : 'Highest Profit Pecentage Wins'}{' '}
          ${(betAmount * 1.9).toFixed(2)}
        </Text>
      </View>
      {!!showFriendOptionId && (
        <View style={styles.overlayContainer}>
          <ChallengeOptionsComponent
            chat={false}
            challengeType={'active'}
            visible={!!showFriendOptionId}
            handleClose={() => setShowFriendOptionId('')}
            userId={showFriendOptionId}
            pending={true}
            betId={betId}
            betAmount={betAmount}
            getAllPendingUserBets={getAllPendingUserBets}
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
export { PendingBetComponent }
