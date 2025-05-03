import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  capitalize
} from '@utils'
import { useFriend } from '@hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationService } from '@navigation'
import { emojiArray } from '@constants/emojiArray'

const CircleUserComponent = memo(({ data, leaderboard, index, game, id, userName }) => {
  const { userInfo, followLoading, isFollowing, handleFollow, handleGetUserInfo } =
    useFriend(data)

  // Use index to assign emoji from the array in order
  const userEmoji = userInfo?.userEmoji || emojiArray[index % emojiArray.length]

  const navigateToProfile = React.useCallback(() => {
    NavigationService.navigate('ProfileUser', { userInfo })
  }, [userInfo])

  const navigateToCompete = React.useCallback(() => {
    NavigationService.navigate('Compete', {
      selectedUser: userInfo,
    })
  }, [userInfo])

  return (
    <>
      <TouchableOpacity onPress={leaderboard ? navigateToProfile : navigateToCompete}>
        <View>
          {!(leaderboard == false) && (
            <Text numberOfLines={1} style={styles.userNameText}>
              {game === true
                ? `${capitalize(userName)}  `
                : userInfo?.userName == undefined
                ? 'Anonymous'
                : userInfo?.userName}{' '}
              {/* Replace 'name' with the actual property in your 'data' object that holds the user's name */}
            </Text>
          )}
          <View style={styles.emojiContainer}>
            {/* <Text style={styles.emojiText}>{game === true ? `😄` : userEmoji}</Text> */}
            <Text style={styles.emojiText}>😄</Text>
          </View>
          {!(leaderboard == true) && (
            <Text numberOfLines={1} style={styles.userNameText2}>
              {game === true ? `${userName}  ` : `${userInfo?.userName}  `}
              {/* Replace 'name' with the actual property in your 'data' object that holds the user's name */}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </>
  )
})
const styles = StyleSheet.create({
  orderOption: {
    borderRadius: 30,
    paddingHorizontal: widthPercentageToDP(4),
    marginHorizontal: widthPercentageToDP(2),
    height: heightPercentageToDP(4.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameText: [
    textStyles.hugeMedium,
    {
      marginVertical: widthPercentageToDP(3),
      marginHorizontal: widthPercentageToDP(1),
      fontSize: actuatedNormalize(13),
      textAlign: 'center',
      color: 'white',
      width: widthPercentageToDP(21),
    },
  ],
  userNameText2: [
    textStyles.hugeMedium,
    {
      marginVertical: widthPercentageToDP(1),
      marginHorizontal: widthPercentageToDP(1),
      fontSize: actuatedNormalize(13),
      textAlign: 'center',
      color: 'white',
      width: widthPercentageToDP(17),
    },
  ],
  emojiContainer: {
    backgroundColor: 'white',
    borderRadius: heightPercentageToDP(30),
    width: widthPercentageToDP(13),
    height: widthPercentageToDP(13),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  emojiText: [
    textStyles.hugeMedium,
    {
      fontSize: actuatedNormalize(11),
      textAlign: 'center',
      color: 'black',
    },
  ],
})
export { CircleUserComponent }
