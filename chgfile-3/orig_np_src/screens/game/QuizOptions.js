import React, { useState } from 'react'
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { colors, heightPercentageToDP, widthPercentageToDP } from '@utils'
import { questions } from '@constants/questions'
import { categoriesWithEmojis } from '@constants/categoriesWithEmojis'
import { Category } from '@components'

const QuizOptions = ({ route }) => {
    const { userLevel } = route.params
  // const uniqueCategories = [
  //   'All Categories',
  //   ...new Set(categoriesWithEmojis.map(item => item.category)),
  // ]
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  const handleCategoryPress = category => {
    setSelectedCategory(category)
  }

  return (
    <View style={styles.mainView}>
      <SafeAreaView style={styles.mainView}>
        <View
          style={{
            paddingHorizontal: widthPercentageToDP(5),
          }}>
          <View
            style={{
              marginTop: heightPercentageToDP(2),
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                marginTop: heightPercentageToDP(2),
                paddingBottom: heightPercentageToDP(10),
              }}>
              {
                categoriesWithEmojis.map((categoryObj, index) => {
                  // Use categoryObj directly, no need to find it again
                  const { category, emoji, explanation, gradientColors } = categoryObj;

                  // Optional: If you still need to find for some reason, handle undefined
                  const foundCategory = categoriesWithEmojis.find(item => item.category === category);
                  if (!foundCategory) {
                    console.error(`Category not found: ${category}`);
                    // Handle the error case, perhaps skip this iteration
                    return null; // Skip this item if not found
                  }
                return (
                  <Category
                    key={category}
                    category={category}
                    emoji={emoji}
                    explanation={explanation}
                    handleCategoryPress={handleCategoryPress}
                    index={index}
                    gradientColors={gradientColors}
                    userLevel={userLevel}
                  />
                )
              })}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
const styles = StyleSheet.create({
  mainView: { backgroundColor: colors.darkBackground, flex: 1 },
  welcomeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export { QuizOptions }
