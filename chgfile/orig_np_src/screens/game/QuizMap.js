import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import LinearGradient from 'react-native-linear-gradient'
import { CustomButton, QuizLevels } from '@components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { categoriesWithEmojis } from '@constants/categoriesWithEmojis'
import { NavigationService } from '@navigation'

const QuizMap = ({ route }) => {
  const { category, emoji, explanation, gradientColors, progress } = route.params
  const progressToIndex = progress => Math.round((progress * 100) / 13)
  const [selectedItem, setSelectedItem] = useState(progressToIndex(progress))
  const handleItemPress = index => {
    // Update the selected item when it is pressed
    setSelectedItem(index)
  }
const [scrollViewHeight, setScrollViewHeight] = useState(0)
const scrollViewRef = React.useRef(null)
const estimatedItemHeight = heightPercentageToDP(8) // Adjust this based on your design

React.useEffect(() => {
  if (scrollViewRef.current) {
    const positionToScroll =
      selectedItem * estimatedItemHeight - scrollViewHeight / 2 + estimatedItemHeight / 2

    scrollViewRef.current.scrollTo({
      y: Math.max(positionToScroll, 0),
      animated: true,
    })
  }
}, [selectedItem, scrollViewHeight])

  return (
    <View style={styles.mainView}>
      <View style={{ marginLeft: widthPercentageToDP(5) }}>
        <Text
          style={[
            styles.header,
            { color: gradientColors[1], marginBottom: heightPercentageToDP(1) },
          ]}>
          Learn & Earn! {emoji}
        </Text>
        <Text
          style={[
            styles.headerBig,
            { color: gradientColors[1], marginBottom: heightPercentageToDP(2) },
          ]}>
          {category}
        </Text>
        <Text style={[styles.explanationText]}>{explanation}</Text>
      </View>
      <LinearGradient
        colors={gradientColors}
        style={[styles.cardContainer]}
        start={{ x: 0, y: 0 }} // Top-left corner
        end={{ x: 1, y: 0.1 }} // Bottom-right corner
      >
        <ScrollView
          ref={scrollViewRef}
          onLayout={event => {
            const height = event.nativeEvent.layout.height
            setScrollViewHeight(height)
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: heightPercentageToDP(2),
              alignItems: 'center',
              flexWrap: 'wrap', // This property enables wrapping
              justifyContent: 'center', // Center the items horizontally
            }}>
            {categoriesWithEmojis.map((item, index) => (
              <QuizLevels
                key={index} // Add a unique "key" prop here
                emoji={item.emoji}
                level={1}
                selected={selectedItem === index}
                index={index}
              />
            ))}
          </View>
        </ScrollView>
        <CustomButton
          text={'Start'}
          style={{ alignSelf: 'center' }}
          onPress={() =>
            NavigationService.navigate('QuizCategory', { categoryParam: category })
          }
        />
      </LinearGradient>
    </View>
  )
}
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.darkBackground,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardContainer: {
    height: heightPercentageToDP(50),
    borderTopRightRadius: actuatedNormalize(19),
    borderTopLeftRadius: actuatedNormalize(19),
    paddingBottom: heightPercentageToDP(2),
  },
  header: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(20),
      marginTop: heightPercentageToDP(3),
    },
  ],
  headerBig: [
    textStyles.bigSemiBold,
    { color: 'white', fontSize: actuatedNormalize(27) },
  ],
  explanationText: [
    textStyles.bigRegular,
    { color: 'gray', fontSize: actuatedNormalize(14), marginBottom: heightPercentageToDP(2) },
  ],
})

export { QuizMap }
