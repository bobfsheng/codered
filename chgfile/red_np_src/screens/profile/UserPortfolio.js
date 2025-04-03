import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Pressable,
  View,
  Text,
} from 'react-native'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  screenTitle,
} from '@utils'
import {
  Icon,
  WatchlistCarousel,
} from '@components'
import { NavigationService } from '@navigation'
import { capitalize } from 'lodash'
import { badgeLevels } from '@constants/badgeLevels'

const UserPortfolio = ({userInfo}) => {
  const [selectedBubbleButton, setSelectedBubbleButton] = useState(1)
  const handleBubbleButtonPress = button => {
    setSelectedBubbleButton(button)
  }
  const [weeklyRank, setWeeklyRank] = useState(!userInfo?.weeklyRank ? '12330': userInfo?.weeklyRank)
  const [weeklyRanke, setWeeklyRanke] = useState(!userInfo?.weeklyRank ? '12330': userInfo?.weeklyRank)


  useEffect(() => {
    ;(async () => {
      try {
        setWeeklyRank(userInfo?.weeklyRank)
        setWeeklyRanke(userInfo?.weeklyRank)
        if (weeklyRank === 1) {
          setWeeklyRank('1st')
        } else if (weeklyRank === 2) {
          setWeeklyRank('2nd')
        } else if (weeklyRank === 3) {
          setWeeklyRank('3rd')
        } else {
          setWeeklyRank(`${weeklyRank}th`)
        }
      } catch (error) {}
    })()
  }, [userInfo])

  const userBio = userInfo?.userBio
  const userEmoji = userInfo?.userEmoji
  const userName = userInfo?.userName
  const portfolioYalue = userInfo?.portfolioYalue
  const watchlist = userInfo?.Watchlist
  


  const getBadgeName = userRank => {
    const badge = badgeLevels.find(
      badge => badge.lowest <= userRank && badge.highest >= userRank,
    )
    return badge ? badge.name : ''
  }

  const getBadgeText = userRank => {
    const badge = badgeLevels.find(
      badge => badge.lowest <= userRank && badge.highest >= userRank,
    )
    return badge ? badge.percent : ''
  }

  const badgeText = getBadgeText(weeklyRanke)
  const badgeName = getBadgeName(weeklyRanke)

  const handlePressOption = callBackFunc => {
    callBackFunc()
  }


  return (
          <>
            {/* BIO */}
            
            <View
              style={{
                marginHorizontal: widthPercentageToDP(3),
              }}>
                         
              <View style={styles.overViewSubContainer}>
              {userBio !== undefined &&
                <Text style={styles.profileBio}>
                  {capitalize(userBio)}
                  {' '}
                  <Icon
                    type="AntDesign"
                    name="exclamationcircle"
                    style={{}}
                    size={widthPercentageToDP(4)}
                    color="gray"
                    onPress={() =>
                      handlePressOption(() =>
                        NavigationService.navigate( 'ReportScreen',
                          { reportedUserId:userInfo.uid },
                        ),
                      )
                    }/>
                </Text>}
              </View>
              {/* RANKS */}
              <Pressable
                onPress={() =>
                  NavigationService.navigate('Home', {
                    screen: 'Leaderboard',
                  })
                }>
                <View style={styles.overViewSubContainer}>
                  <Text style={styles.profileInfo}>
                    {weeklyRank == 'undefinedth' ? 'Trade to rank' : badgeName} 🏆
                  </Text>
                  <Text style={[styles.profileInfo, { color: 'gray' }]}>{badgeText}</Text>
                </View>
              
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginVertical: heightPercentageToDP(2),
                  marginLeft: widthPercentageToDP(0.2),
                }}>

            <WatchlistCarousel array={watchlist}/>
       
              </View>
            </View>
          </>
      
  )
}

const styles = StyleSheet.create({
  overViewSubContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  profileBio: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(15.3),
      color: 'white',
    },
  ],
  profileInfo: [
    screenTitle,
    textStyles.hugeBold,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
    },
  ],
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'gray',
    },
  ],
  categoryStyle:{
    borderRadius:10, 
    borderColor:'#648C38',
    borderWidth:widthPercentageToDP(0.5)
  }
})
export { UserPortfolio }