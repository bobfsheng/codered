import React, { useState } from 'react'
import { StyleSheet, Pressable, View, Text, SafeAreaView } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { CustomAccountStatusBar, HorizontalRule, Icon } from '@components'
import { ProfilePortfolio } from './ProfilePortfolio'
import { ProfileMain } from './ProfileMain'
import { NavigationService } from '@navigation'
import { Friends } from './Friends/Friends'
import { Challenges } from './Challenges'

const Profile = () => {
const [selectedButton, setSelectedButton] = useState(1)

  const handleButtonPress = button => {
    setSelectedButton(button)
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topSection}>
        <View style={styles.topIconContainer}>
          <Icon
            type="Ionicons"
            name="gift-sharp"
            size={widthPercentageToDP(7)}
            color={colors.primary2}
            onPress={() => NavigationService.navigate('Purchases', {})}
          />
          {/* <View></View> */}
          <Icon
            type="Ionicons"
            name="settings-outline"
            size={widthPercentageToDP(7)}
            color={colors.primary2}
            onPress={() => NavigationService.navigate('Settings', {})}
          />
        </View>
      </View>

      <CustomAccountStatusBar showInPercentage={false} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: heightPercentageToDP(2),
          marginHorizontal: heightPercentageToDP(2),
        }}>
        <Pressable onPress={() => handleButtonPress(1)}>
          <Text
            style={selectedButton === 1 ? styles.selectedText : styles.unSelectedText}>
            {'Profile'}
          </Text>
        </Pressable>
        <Pressable onPress={() => handleButtonPress(2)}>
          <Text
            style={selectedButton === 2 ? styles.selectedText : styles.unSelectedText}>
            {'Portfolio'}
          </Text>
        </Pressable>
        <Pressable onPress={() => handleButtonPress(4)}>
          <Text
            style={selectedButton === 4 ? styles.selectedText : styles.unSelectedText}>
            {/* style={{color:colors.darkBackground}}> */}
            {'Friends'}
          </Text>
        </Pressable>
        <Pressable onPress={() => handleButtonPress(3)}>
          <Text
            style={selectedButton === 3 ? styles.selectedText : styles.unSelectedText}>
            {/* style={{color:colors.darkBackground}}> */}
            {'Challenges'}
          </Text>
        </Pressable>
      </View>
      <HorizontalRule />
      {/* SELECTED 1 */}
      {selectedButton === 1 && <ProfileMain />}
      {selectedButton === 2 && <ProfilePortfolio />}
      {selectedButton === 4 && <Friends />}
      {/* add search bar */}
      {selectedButton === 3 && <Challenges profile={true} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingTop: 25, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(0),
  },
  topSection: {
    justifyContent: 'space-between',
    marginBottom: heightPercentageToDP(2),
  },
  topIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthPercentageToDP(3),
  },
  positionMainContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: widthPercentageToDP(3),
  },

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
})
export { Profile }
